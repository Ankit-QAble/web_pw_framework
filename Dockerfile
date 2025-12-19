# Use the local mcp/playwright image
FROM mcp/playwright:latest

# Switch to root to avoid permission issues during build
USER root

# Ensure we install dev dependencies
ENV NODE_ENV=development

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Debug info
RUN echo "User: $(whoami)"
RUN ls -la node_modules/.bin
RUN ./node_modules/.bin/playwright --version

# Install Playwright browsers using local CLI
RUN ./node_modules/.bin/playwright install chromium

# Copy the rest of the project files
COPY . .

# Default command to run tests
CMD ["npx", "playwright", "test"]
