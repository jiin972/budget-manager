FROM node:20-alpine

#python 및 빌드도구 추가
RUN apk add --no-cache python3 make g++


WORKDIR /app
# 패키지 파일 먼저 복사 (캐싱 활용)
COPY package*.json ./
RUN npm install

#소스코드 복사
COPY . .

#NextJS 개발서버 개방
EXPOSE 3000

CMD [ "npm", "run", "dev" ]
