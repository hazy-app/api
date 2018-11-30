FROM node:8

WORKDIR /app 

COPY . /app 

RUN apt-get update && apt-get install -y build-essential && apt-get install -y python
EXPOSE 3002
RUN npm install 
CMD ["npm","start"]

