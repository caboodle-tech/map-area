#/bin/bash

git filter-branch --force --commit-filter '
        if [ "$GIT_COMMITTER_EMAIL" = "cdkeers@gmail.com" ];
        then
                export GIT_COMMITTER_NAME="Christopher Keers";
                export GIT_AUTHOR_NAME="Christopher Keers";
                export GIT_COMMITTER_EMAIL="blizzardengle@users.noreply.github.com";
                export GIT_AUTHOR_EMAIL="blizzardengle@users.noreply.github.com";
        fi;
        git commit-tree "$@"
' --tag-name-filter cat -- --all