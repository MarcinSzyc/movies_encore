FROM node:14.15-alpine

WORKDIR /movies

COPY ./movies/package*.json ./

RUN npm install

COPY ./movies .

RUN npm run build

CMD ["npm", "run", "start"]