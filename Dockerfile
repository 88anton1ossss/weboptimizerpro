FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Build TypeScript + frontend
RUN npm run build

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
