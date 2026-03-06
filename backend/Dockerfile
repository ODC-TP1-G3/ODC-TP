FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate

EXPOSE 4000

CMD ["sh", "-c", "sleep 15 && npx prisma migrate deploy && node src/seed.js && node src/index.js"]
