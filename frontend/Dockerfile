FROM node:18.15-bullseye

RUN apt update -y && apt upgrade -y

WORKDIR /inception_nextjs

COPY package*.json /inception_nextjs/

RUN npm install

COPY ./ /inception_nextjs/

EXPOSE 3002

CMD [ "npm", "run", "dev"]
