FROM node:8

WORKDIR /app 

COPY . /app 

EXPOSE 3002
RUN npm install 
CMD ["npm","start"]

