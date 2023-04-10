FROM node:18.15-alpine3.17

RUN apk update && apk upgrade

RUN npm i -g pnpm

WORKDIR /trancendence_nextjs

COPY package*.json /trancendence_nextjs/

COPY pnpm-lock.yaml /trancendence_nextjs/

RUN pnpm install

COPY ./ /trancendence_nextjs/

EXPOSE 3000

ENTRYPOINT ["npx", "next", "start"]
