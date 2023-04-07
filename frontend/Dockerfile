FROM node:18.15-bullseye

RUN apt update -y && apt upgrade -y

RUN npm i -g pnpm

WORKDIR /trancendence_nextjs

COPY package*.json /trancendence_nextjs/

COPY pnpm-lock.yaml /trancendence_nextjs/

RUN pnpm install

COPY ./ /trancendence_nextjs/

EXPOSE 3000

ENTRYPOINT ["npx", "next", "start"]
