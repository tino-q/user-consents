FROM node:14-alpine
EXPOSE 3000

RUN apk update
RUN apk add dos2unix

WORKDIR /home/app

COPY package.json /home/app/
COPY package-lock.json /home/app/

RUN npm install

COPY . /home/app

RUN npm run build

RUN dos2unix /home/app/entrypoint.sh

CMD ./entrypoint.sh