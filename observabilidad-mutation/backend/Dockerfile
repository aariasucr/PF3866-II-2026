FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund || npm install --no-audit --no-fund
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]
