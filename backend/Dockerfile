FROM node:18.15-bullseye

RUN apt update -y && apt upgrade -y

WORKDIR /inception_nestjs

COPY package*.json ./

RUN npm install

COPY ./ /inception_nestjs

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
