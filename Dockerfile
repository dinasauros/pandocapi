FROM node:20

RUN apt-get update && apt-get install -y pandoc

WORKDIR /app

COPY . .

RUN npm install

CMD ["node", "server.js"]