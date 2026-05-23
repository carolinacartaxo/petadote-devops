FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY prisma ./prisma
RUN ./node_modules/.bin/prisma generate

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
