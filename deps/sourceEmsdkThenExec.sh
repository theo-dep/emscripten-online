#!/bin/bash

export EMSDK_QUIET=1
source "$(dirname "$0")/emsdk/emsdk_env.sh"
"$@"
