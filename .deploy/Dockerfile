# broke normal building, because of low power vm at hosting
FROM node:18.18.2-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . /app
RUN npm run build


FROM nginx:1.16.0-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY .deploy/nginx.conf /etc/nginx/conf.d
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]