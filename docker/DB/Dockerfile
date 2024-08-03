# Choose the base image
FROM mcr.microsoft.com/mssql/server:2022-latest

# Switch to root user
USER root

# Create app directory
WORKDIR /usr/src/app

# Copy initialization scripts
COPY ./docker/DB/ /usr/src/app

# Copy SQL files
COPY ./database/ /usr/src/app

# Set environment variables, not have to write them with the docker run command
# Note: make sure that your password matches what is in the run-initialization script 

WORKDIR /usr/src/app
ENV SA_PASSWORD EZPZOSAdmin!
ENV ACCEPT_EULA Y
ENV MSSQL_PID Express

# Expose port 1433 in case accessing from other container
# Expose port externally from docker-compose.yml
EXPOSE 1433

# 切换到 root 用户并安装依赖
USER root

# 更新包列表和安装依赖
RUN apt-get update && \
    apt-get install -y curl apt-transport-https gnupg2 software-properties-common

# 添加 Microsoft 的密钥和源列表
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > /etc/apt/sources.list.d/mssql-release.list

# 更新 apt-get 并安装 sqlcmd 工具
RUN apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql17 mssql-tools

# 清理
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Run Microsoft SQL Server and initialization script (at the same time)
CMD bash ./entrypoint.sh
