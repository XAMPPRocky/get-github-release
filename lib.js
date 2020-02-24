const fs = require('fs')
const path = require('path')
const process = require('process')
const util = require('util')

const writeFile = util.promisify(fs.writeFile)

// Third Party libraries
const core = require('@actions/core')
const exec = require('@actions/exec')
const github = require('@actions/github')
const fetch = require('node-fetch')

/**
 * Fetches the latest release from `owner/repo` on GitHub that matches the
 * `matches` regular expression, and installs the binary to `installPath`. By
 * default the install path is `/tmp/<repo name>`. This function requires a valid
 * GitHub `token` that is able to read the repository.
 *
 * @param {string} owner - The owner of the repository.
 * @param {string} repo - The name of the repository
 * @param {Regex} matches - The regex to match against the name pick the
 * specific asset in the release.
 * @param {string} token - A GitHub token, with `read` permissions on
 * the repository.
 * @param {string} [installPath='/tmp/'] - The path to install the binary.
 */
exports.getGitHubRelease = async function (owner, repo, matches, token, installPath = '/tmp/') {
  try {
    const octokit = new github.GitHub(token)

    // Retrieve first release that matched `regex` and download a tar archive of
    // the binary.
    const url = (await octokit.repos.getLatestRelease({ owner, repo }))
      .data
      .assets
      .find(asset => asset.name.match(matches))
      .browser_download_url

    let downloadPath = installPath
    let command = null

    if (url.endsWith('tar.gz')) {
      downloadPath += `${repo}.tar.gz`
      command = ['tar', ['-xvzf', downloadPath]]
    } else if (url.endsWith('7z') || url.endsWith('zip')) {
      downloadPath += `${repo}.zip`
      command = ['7z', ['x', downloadPath]]
    } else {
      core.info(`Unknown File Extension, no extraction performed.\nURL: ${url}`)
    }

    await writeFile(downloadPath, await (await fetch(url)).buffer())
    if (command) {
      await exec.exec(...command, { cwd: path.dirname(installPath) })
    }

    core.setOutput('install_path', installPath)
    return installPath
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
