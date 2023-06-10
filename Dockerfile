# Use a base Node.js image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]