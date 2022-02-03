FROM node:16-alpine AS local
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY ./src ./src

FROM local AS builder
RUN npm run build

FROM node:16-alpine
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci
COPY --from=builder ./dist/ dist/
EXPOSE 3000
CMD node dist/main