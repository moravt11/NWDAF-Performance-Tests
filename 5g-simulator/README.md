# 5G Network Function Simulator

This project simulates communication between two 5G network functions: NWDAF (Network Data Analytics Function) and SMF (Session Management Function) using WireMock.

## Project Structure

```
5g-simulator
├── nwdaff
│   ├── Dockerfile
│   ├── wiremock
│   │   ├── mappings
│   │   │   └── mapping.json
│   │   └── __files
│   │       └── response.json
├── smf
│   ├── Dockerfile
│   ├── wiremock
│   │   ├── mappings
│   │   │   └── mapping.json
│   │   └── __files
│   │       └── response.json
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Building the Docker Images

To build the Docker images for NWDAF and SMF, navigate to the project directory and run:

```bash
docker-compose build
```

### Running the Simulator

To start the simulator, use the following command:

```bash
docker-compose up
```

This will start both NWDAF and SMF services, allowing them to communicate with each other.

### Accessing the Services

Once the services are running, you can access them via the following endpoints:

- NWDAF: `http://localhost:<NWDAF_PORT>`
- SMF: `http://localhost:<SMF_PORT>`

Replace `<NWDAF_PORT>` and `<SMF_PORT>` with the actual ports defined in the `docker-compose.yml` file.

## Customizing Mappings

You can customize the request-response mappings by editing the `mapping.json` files located in:

- `nwdaff/wiremock/mappings/mapping.json`
- `smf/wiremock/mappings/mapping.json`

The corresponding response bodies can be modified in:

- `nwdaff/wiremock/__files/response.json`
- `smf/wiremock/__files/response.json`

## Contributing

Feel free to contribute to this project by submitting issues or pull requests. Your feedback and contributions are welcome!

## License

This project is licensed under the MIT License.

# NWDAF Performance Tests

This project contains performance tests for NWDAF (Network Data Analytics Function) using K6, InfluxDB, and Grafana.

## Test Types

The system supports four different types of performance tests:

1. **LOAD Test**: Simulates expected normal load with moderate virtual users
2. **STRESS Test**: Gradually increases load until the system breaks to find breaking points
3. **SOAK Test**: Sustains moderate load over a long period to find memory leaks or performance degradation
4. **SPIKE Test**: Simulates sudden spikes in traffic to test system recovery

## Running Tests with Docker Compose

You can run the tests using Docker Compose by specifying the TEST_TYPE environment variable:

```bash
# Run load test (default)
docker-compose up

# Or specify a test type
docker-compose up -e TEST_TYPE=LOAD   # Normal load test
docker-compose up -e TEST_TYPE=STRESS # Stress test
docker-compose up -e TEST_TYPE=SOAK   # Soak test (long duration)
docker-compose up -e TEST_TYPE=SPIKE  # Spike test
```

Alternatively, you can set the TEST_TYPE in the docker-compose.yml file before running docker-compose up.

## Test Configuration

Each test type has its own configuration defined in separate files:

- `config/testTypes/loadTest.js`
- `config/testTypes/stressTest.js`
- `config/testTypes/soakTest.js`
- `config/testTypes/spikeTest.js`

You can customize these configurations by editing the respective files.

## Viewing Results

- The test results are stored in InfluxDB
- Access Grafana at http://localhost:3000 to view dashboards
- Default Grafana login: admin/admin