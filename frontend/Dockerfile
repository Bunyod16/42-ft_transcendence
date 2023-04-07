FROM node:18.15-bullseye

RUN apt update -y && apt upgrade -y

WORKDIR /trancendence_nextjs

COPY package*.json /trancendence_nextjs/

RUN npm install

COPY ./ /trancendence_nextjs/

EXPOSE 3000

ENTRYPOINT ["npx", "next", "start"]
