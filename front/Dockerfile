FROM node:18.17.0-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

EXPOSE 8080

CMD [ "npm", "run", "preview" ]
