# Choose ubuntu version
FROM node:22.6.0


# Create app directory
WORKDIR /app

COPY EZPZos.Core /app/EZPzos.Core
COPY EZPZOS.Express /app/EZPZOS.Express

RUN ls /app

# Install dependencies

RUN cd /app/EZPZos.Core && npm install && npm run build && \
    cd /app/EZPZOS.Express && npm instal1 && npm run build

EXPOSE 8000
CMD cd /app/EZPZOS.Express && npm start
