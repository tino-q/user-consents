FROM node:14-alpine
EXPOSE 3000

WORKDIR /home/app

COPY package.json /home/app/
COPY package-lock.json /home/app/

RUN npm ci

COPY . /home/app

RUN npm run build

CMD ./entrypoint.sh