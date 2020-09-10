FROM node:12

ARG work_dir="/usr/src/app"
WORKDIR ${work_dir}

RUN apt-get update && \
    apt-get install -y \
    sudo \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add - && \
    add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/debian \
    $(lsb_release -cs) \
    stable" && \
    apt-get update && \
    apt-get install -y \
    docker-ce-cli \
    imagemagick

COPY package-lock.json package-lock.json
COPY package.json package.json

RUN npm ci

COPY . ./

EXPOSE 3000

ENTRYPOINT [ "npx", "ts-node", "src/main.ts" ]
