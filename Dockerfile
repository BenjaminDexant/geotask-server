# First stage: build
FROM node:lts AS builder

WORKDIR /server

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY tsconfig.json ./
COPY prisma prisma
COPY src src

RUN yarn cache clean --mirror
RUN yarn build

# Second stage: install and run
FROM node:lts AS installer

WORKDIR /server

COPY package.json .
COPY yarn.lock .

RUN yarn --production --frozen-lockfile
RUN rm -rf /usr/local/share/.cache/

COPY --from=builder /server/dist dist
COPY --from=builder /server/prisma prisma
COPY --from=builder /server/node_modules/.prisma node_modules/.prisma

CMD node dist/src/index