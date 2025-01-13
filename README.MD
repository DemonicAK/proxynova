# ProxyNova

ProxyNova is a lightweight, scalable HTTP proxy server built with Node.js and TypeScript, inspired by NGINX. This project uses clustering and worker processes to distribute incoming HTTP requests efficiently.

## Features

- Load balancing across worker processes
- Dynamic request routing based on configuration rules
- Configurable upstream servers for proxying requests
- Easy-to-extend architecture

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/DemonicAK/proxynova.git
   cd proxynova
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

## Configuration

The server is configured using a YAML file specifying server rules and upstream servers. Example `config.yaml`:

```yaml
server:
  listen: 3000
  workers: 4
  headers:
    - key: "Content-Type"
      value: "application/json"
    - key: "Cache-Control"
      value: "no-cache"
  upstreams:
    - id: "service1"
      url: "http://localhost:4000"
    - id: "service2"
      url: "http://localhost:5000"
  rules:
    - path: "/api"
      upstreams: ["service1", "service2"]
    - path: "/auth"
      upstreams: ["service1"]

```


## Running the Server

```bash
npm run build  # Compile TypeScript files
node dist/index.js --config path/to/config.yaml
```

The server will start on the specified port with the configured number of workers.

## Project Structure

```
├── src
│   ├── config-schema.ts      # Schema for configuration validation
│   ├── server-schema.ts      # Schema for inter-process messaging
│   ├── config.ts             # Configuration parser and validator
│   ├── server.ts             # Main server logic with clustering
│   └── index.ts              # Entry point for the server
├── config.yaml               # Example configuration file
├── package.json
├── tsconfig.json
└── README.md
```

## Commands

- **Build the project:**

  ```bash
  npm run build
  ```

- **Start the server:**

  ```bash
  node dist/index.js --config path/to/config.yaml
  ```

## Future Enhancements

- HTTPS support
- Dynamic configuration reload without downtime
- Advanced load-balancing strategies (Round Robin, Least Connections)

## License

- Dynamic configuration reload without downtime
- Advanced load-balancing strategies (Round Robin, Least Connections)

## **License**

This project is licensed under the MIT License.
