FROM node:22-slim

ARG PROWLER_VERSION=3.11.3

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates python3 python3-pip \
  && python3 -m pip install --break-system-packages --no-cache-dir "prowler==${PROWLER_VERSION}" \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npx prisma generate

EXPOSE 3000

ENV PROWLER_VERSION=${PROWLER_VERSION}
