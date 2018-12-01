FROM node:8

WORKDIR /app 

COPY . /app 

EXPOSE 3002
RUN apt-get update && apt-get install -y build-essential && apt-get install -y python && npm install

CMD ["npm","start"]

