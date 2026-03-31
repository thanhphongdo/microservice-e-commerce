FROM node:24-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

EXPOSE 3700

CMD ["npm", "run", "dev", "--", "-p", "3700"]
