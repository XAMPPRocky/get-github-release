#!/usr/bin/env bash

set -e

INPUT_REPO=mdbook \
INPUT_MATCHES=apple \
INPUT_OWNER=rust-lang \
INPUT_TOKEN=$GITHUB_API_KEY \
RUNNER_TEMP=/tmp/ \
RUNNER_TOOL_CACHE=/tmp/ \
node index.js
/tmp/mdbook -h
