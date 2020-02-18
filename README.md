# get-github-release

The `get-github-release` action allows you to get any binary release on GitHub.
See [`actions.yml`] for configuration options.

[`actions.yml`]: ./actions.yml

## Example
This example builds an mdbook project on linux.

```yaml
- uses: XAMPPRocky/get-github-release@v1
  with:
    matches: unknown-linux-gnu
    owner: rust-lang
    repo: mdbook
    token: "${{ secrets.GITHUB_TOKEN }}"
```

## Development

The action is written in NodeJS 12, and you can install the dependencies with:

```
npm install
```

### Running

```
npm start
```

GitHub Actions requires all the dependencies to be committed, so before
creating a commit you need to run:

```
npm run build
```

The command will bundle everything in `dist/index.js`. That file will need to
be committed.
