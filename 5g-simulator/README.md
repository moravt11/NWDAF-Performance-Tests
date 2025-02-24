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