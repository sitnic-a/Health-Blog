# FROM node:18.20.8-alpine
# WORKDIR /app
# COPY ["package.json", "." ]
# RUN npm install
# COPY .env .env
# COPY . .
# EXPOSE 3000
# CMD ["npm", "start"]


# build folder
FROM node:18.20.8-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY .env .env
COPY . .
RUN npm run build

# production stage
FROM node:18.20.8-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]