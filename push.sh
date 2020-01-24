#!/bin/bash

source ./dev-tools/scripts/git/_core.sh
source ./dev-tools/scripts/_core-tools/_source.sh

version=`getVersionName version-nu-art.json`

if [[ "${1}" ]]; then
    version=${1}
fi

if [[ ! "${version}" ]]; then
    throwError "Could not resolve version!" 2
fi

bash ./dev-tools/scripts/git/gist-pull.sh -a -f

bash ./build-and-install.sh --lint
throwError "Error linting and building Thunderstorm" $?


modules=(ts-common testelot thunder storm)
submodulesLog=""
for module in ${modules[@]}; do
    cd ${module}
        moduleLog=`git log --pretty=oneline --decorate=no --invert-grep --grep="lint" --grep="version bumped" --grep="shit" --no-merges v${version}... | sed -E "s/[0-9a-f]*( .*)/  * \1\n/g"`
        gitAssertRepoClean
        if [[ "${moduleLog}" ]]; then
            submodulesLog="${submodulesLog}${module}:\n${moduleLog}\n\n"
        fi
    cd ..
done

bash ./dev-tools/scripts/git/git-push.sh --this -m="${submodulesLog}"
throwError "Error pushing Thunderstorm" $?

