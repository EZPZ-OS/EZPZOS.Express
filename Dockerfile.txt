# Choose ubuntu version
FROM node:22.6.0

WORKDIR /usr/src/app

RUN apt update &&\
    apt-get install -y  unixodbc-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy the package.json and package-lock.json files
COPY EZPZOS.Core /usr/src/EZPZOS.Core
COPY . /usr/src/app


RUN cd /usr/src/EZPZOS.Core &&\
    npm install && npm run build  && \
    cd /usr/src/app && \
    npm install

# Expose the application port
EXPOSE 8000

# Command to run the application
CMD ["npm", "start"]
