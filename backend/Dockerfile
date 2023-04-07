FROM node:18.15-bullseye

RUN apt update -y && apt upgrade -y

WORKDIR /trancendence_nestjs

COPY package*.json /trancendence_nestjs/

RUN npm install

COPY ./ /trancendence_nestjs/

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["node", "dist/main"]
