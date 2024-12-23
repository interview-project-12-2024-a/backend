FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN touch service-account.json

COPY . .

COPY .env ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]