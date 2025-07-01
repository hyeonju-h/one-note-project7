# 베이스 이미지 설정
FROM node:18

# 앱 디렉터리 생성
WORKDIR /app

# package.json, package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 앱 소스 복사
COPY . .

# 서버 포트 오픈 (필요에 따라 5000, 4000, 3000 등 맞게 수정)
EXPOSE 5000

# 서버 실행
CMD ["node", "index.js"]
