# Use a base Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

COPY package*.json ./

#RUN npm install --production
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
