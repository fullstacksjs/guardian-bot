FROM node:12-alpine

WORKDIR /app

COPY package.json .
RUN yarn install

COPY . /app
RUN yarn build

CMD [ "yarn", "start" ]
EXPOSE 7001
