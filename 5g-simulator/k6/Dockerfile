FROM grafana/k6:latest

# Create app directory
WORKDIR /app

# Copy test files
COPY . .

# Set environment variables with defaults
ENV TEST_TYPE=SPIKE

# Set the entrypoint to run the test with the configured test type
ENTRYPOINT ["k6", "run", "--out", "influxdb=http://influxdb:8086/k6", "/app/test.js"]