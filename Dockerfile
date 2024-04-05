FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /app

# Copy both package.json and package-lock.json (if exists)
COPY package*.json ./

COPY start.sh ./
RUN chmod +x start.sh

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ./src ./src

RUN chmod +x start.sh

CMD ["sh","./start.sh"]