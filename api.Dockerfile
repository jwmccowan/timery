FROM node:15.1.0-alpine as build

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY app/api ./app/api

RUN yarn install --pure-lockfile --non-interactive

WORKDIR /usr/src/app/app/api
RUN yarn build

FROM node:15.1.0-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

COPY --from=build /usr/src/app/app/api/package.json /usr/src/app/app/api/package.json
COPY --from=build /usr/src/app/app/api/dist /usr/src/app/app/api/dist

ENV NODE_ENV production

RUN yarn install --pure-lockfile --non-interactive --production

WORKDIR /usr/src/app/app/api

CMD ["yarn", "start:prod"]
