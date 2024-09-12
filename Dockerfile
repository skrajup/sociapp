FROM alpine:latest

WORKDIR /usr/app

COPY . .

RUN apk add nodejs npm
RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]