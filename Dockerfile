FROM node:20 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# Stage 2: Run
FROM node:20
WORKDIR /app
COPY --from=build /app/build /app
COPY --from=build /app/package*.json ./

# Установка serve
RUN npm install -g serve

EXPOSE 3000

# Запуск сервера
CMD ["serve", "-s", ".", "-l", "3000"]