FROM node:15

RUN wget http://download.redis.io/redis-stable.tar.gz && \
    tar xvzf redis-stable.tar.gz && \
    cd redis-stable && \
    make && \
    mv src/redis-server /usr/bin/ && \
    cd .. && \
    rm -r redis-stable && \
    npm install -g concurrently

WORKDIR /Users/williammatrix/Desktop/project-4
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

EXPOSE 6379



CMD ["concurrently", "/usr/bin/redis-server --bind '0.0.0.0'", "sleep 5s; npm run app-server"]     

