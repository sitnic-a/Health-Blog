FROM node:18.20.8-alpine
WORKDIR /app
EXPOSE 3000
COPY ["package.json", "." ]
RUN npm install
COPY . .
RUN npm run build
CMD [ "npm", "start" ]