FROM node:18.15-bullseye

RUN apt update -y && apt upgrade -y

WORKDIR /inception_nextjs

COPY package*.json /inception_nextjs/

RUN npm install

COPY ./ /inception_nextjs/

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npx", "next", "start"]
