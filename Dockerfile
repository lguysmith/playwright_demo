FROM mcr.microsoft.com/playwright:v1.56.0-jammy

# 2. Set working directory
WORKDIR /app

# 3. Copy package files first (better caching)
COPY package.json package-lock.json* ./

# 4. Install dependencies
RUN npm ci

# 5. Copy the rest of your project
COPY . .

# 6. Default command: run tests
CMD ["npx", "playwright", "test"]
