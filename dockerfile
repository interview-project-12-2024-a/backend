FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN touch service-account.json

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]