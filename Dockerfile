FROM node:8

WORKDIR /app 

COPY . /app 

ENV HOST="0.0.0.0" 
ENV PORT="3002" 
ENV NODE_ENV="production" 

EXPOSE 3002
RUN npm install 
RUN npm run build 
CMD ["npm","start"]

