FROM node:18.15-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf
RUN npm install --only=development

COPY . .

EXPOSE 3000
CMD [ "npm", "run", "start" ]

