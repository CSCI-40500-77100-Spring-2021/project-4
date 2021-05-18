FROM node:16.1.0

WORKDIR /Users/williammatrix/Desktop/project-4/microservices

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 6000

CMD ["npm", "run", "email-server"]