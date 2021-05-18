FROM node:12-alpine as base

RUN apk update && apk add python g++ make && rm -rf /var/cache/apk/*

WORKDIR /app
COPY package*.json /app/
RUN npm ci

#EXPOSE 3000

# FROM base as production
# ENV NODE_ENV=production
# COPY . /
# CMD ["node", "bin/www"]
# 
# FROM base as dev
# ENV NODE_ENV=development
# RUN npm install -g nodemon && npm install
# COPY . /
# CMD ["nodemon", "bin/www"]

FROM base as api

FROM base as web

FROM base as cli
COPY server/ /app/server
WORKDIR /app/server
