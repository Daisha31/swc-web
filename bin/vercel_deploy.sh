#!/usr/bin/env bash

set -e
npx prisma generate
npm run intl:extract-compile
npm run codegen
npm run lint
NODE_ENV=test npm run test
# If the branch is a db changes branch, we're going to skip building the preview because it's pointing to a database without the changes (testing)
if [[ $VERCEL_GIT_COMMIT_REF == "main" ]]; then
    echo "pushing database changes"
    npx prisma db push --skip-generate
elif [[ $VERCEL_GIT_COMMIT_REF == "deploy-web-production" ]]; then
    echo "Skip pushing database changes on production branch. Open a deploy request in PlanetScale to upgrade schema."
else
    echo "Skip pushing database changes on preview branches to prevent accidently overridding the testing db schema with branch changes before they're ready to merge. You should be running npx prisma db push against your developer branch as needed locally."
fi
echo "Running build"
npm run ts src/bin/vercelPrebuild.ts
npm run build
wait
echo "frontend assets built"
