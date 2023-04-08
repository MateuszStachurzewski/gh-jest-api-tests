FROM node:19.8.1-alpine

WORKDIR /tests

COPY . .
RUN npm ci

CMD npm run tests