FROM node:20-alpine

WORKDIR /app

# Копируй package files
COPY package*.json ./

# Установи всё (включая devDependencies для tsc и vite)
RUN npm install

# Копируй весь проект
COPY . .

# Собери: скомпилируй server.ts + frontend Vite
RUN npm run build

# Убери devDependencies для prod
RUN npm prune --omit=dev

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
