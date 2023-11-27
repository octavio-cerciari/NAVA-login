 FROM node:14-alpine

 WORKDIR /database
 
 COPY package.json .
 COPY package-lock.json .

 RUN npm install

 COPY . .
 
 EXPOSE 3000