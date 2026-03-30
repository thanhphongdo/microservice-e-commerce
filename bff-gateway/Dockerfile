FROM node:24-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

EXPOSE 3000 9229

CMD ["npm", "run", "start:debug"]
