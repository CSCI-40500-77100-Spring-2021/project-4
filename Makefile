# "app-server": "nodemon server.js",
#     "redis-server": "redis-server /usr/local/etc/redis.conf",
#     "server": "concurrently \"npm run redis-server\" \"npm run app-server\""

app-server:
	nodemon server.js
redis-server:
	redis-server /usr/local/etc/redis.conf
server:
	concurrently \"npm run redis-server\" \"npm run app-server\"