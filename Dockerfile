FROM node:12-alpine

COPY . /var/www
WORKDIR /var/www
RUN npm run-script build
ENTRYPOINT [ "npm","start" ]
EXPOSE 3000