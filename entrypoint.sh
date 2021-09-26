npm run build
npm run migrate
if [[ "${NODE_ENV}" == "test" ]]; then
  # npm run test
  npm run test:e2e
else
  npm run start:prod
fi
