FROM node:18.15-alpine3.17

RUN apk update && apk upgrade

WORKDIR /trancendence_nestjs

COPY package*.json /trancendence_nestjs/

RUN npm install

COPY ./ /trancendence_nestjs/

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["node", "dist/main"]
