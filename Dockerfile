
# Stage 1: Build Angular
FROM node:24.19.0-bookworm-slim AS build

WORKDIR /app

COPY package*.json ./

ENV HUSKY=0
RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/momentum/browser/ /usr/share/nginx/html/

EXPOSE 80
