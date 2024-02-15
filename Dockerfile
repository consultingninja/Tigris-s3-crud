FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
COPY ./build ./build
EXPOSE 3000
WORKDIR /app/build
CMD ["node","index.js"]