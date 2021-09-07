FROM node:bullseye
WORKDIR /usr/src/app
COPY . .
RUN yarn install
EXPOSE 8080
CMD [ "node", "." ]
