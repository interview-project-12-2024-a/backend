FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x /usr/src/app/docker-entrypoint.sh

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]