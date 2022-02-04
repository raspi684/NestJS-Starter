FROM node:16-alpine AS local
WORKDIR /home/node/app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./

FROM local AS builder
WORKDIR /home/node/app
COPY ./src ./
RUN npm run build

FROM node:16-alpine
WORKDIR /home/node/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci
COPY --from=builder ./dist ./
EXPOSE 3000
CMD node dist/main