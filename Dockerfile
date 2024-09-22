# Choose ubuntu version
FROM node:22.6.0


# Create app directory
WORKDIR /app

COPY EZPZOS.Core /app/EZPZOS.Core
COPY EZPZOS.Express /app/EZPZOS.Express

RUN ls /app

# Install dependencies

RUN cd /app/EZPZOS.Core && npm install && npm run build && \
    cd /app/EZPZOS.Express && npm install && npm run build

EXPOSE 8000
CMD cd /app/EZPZOS.Express && npm start
