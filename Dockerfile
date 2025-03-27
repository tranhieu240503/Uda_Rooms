# Sử dụng Node.js làm base image
FROM node:18

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ code vào container
COPY . .

# Expose port 5000 cho backend
EXPOSE 8000

# Chạy ứng dụng
CMD ["node", "server.js"]
