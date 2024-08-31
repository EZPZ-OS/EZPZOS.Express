# Choose ubuntu version
FROM mcr.microsoft.com/mssql/server:2022-latest
FROM node:22.6.0


# Create app directory
WORKDIR /usr/src/app

COPY . /usr/src/app

WORKDIR /usr/src/app
ENV SA_PASSWORD EZPZOSAdmin!
ENV ACCEPT_EULA Y
ENV MSSQL_PID Express
RUN npm i && npm run build
RUN apt-get update && \
    apt-get install -y curl apt-transport-https && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/debian/$(lsb_release -rs)/prod.list | tee /etc/apt/sources.list.d/msprod.list && \
    apt-get update && \
    apt-get install -y mssql-tools unixodbc-dev && \
    rm -rf /var/lib/apt/lists/*

# Expose port 1433 in case accessing from other container
# Expose port externally from docker-compose.yml
EXPOSE 1433


# Run Microsoft SQL Server and initialization script (at the same time)


CMD npm start