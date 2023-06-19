###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine AS development

WORKDIR /usr/src/app

RUN apk add --no-cache build-base g++ cairo-dev jpeg-dev pango-dev giflib-dev

COPY --chown=node:node package*.json ./

RUN npm install && npm ci

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine AS build

WORKDIR /usr/src/app

RUN apk add --no-cache build-base g++ cairo-dev jpeg-dev pango-dev giflib-dev

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build

COPY --chown=node:node --from=development /usr/src/app/package-lock.json ./
RUN npm ci --only=production && npm cache clean --force
USER node

###################
# PRODUCTION
###################

FROM node:18-alpine AS production

RUN apk add --no-cache cairo jpeg pango giflib

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/src/main.js" ]
