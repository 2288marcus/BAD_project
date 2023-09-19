set -e

npm run build

# rsync -SavLP dist project:~/ppp/

scp -r \
  package.json \
  dist \
  public \
  project:~/ppp/

ssh project "
cd ppp && \
npm i && \
cp .env dist/ && \
cd dist && \
npx knex migrate:latest && \
pm2 reload ppp
"
