FROM node:14 as build

WORKDIR /app

COPY . .

RUN yarn

CMD ["yarn", "start"]