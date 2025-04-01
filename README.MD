# ProxyNova

ProxyNova is a lightweight HTTP proxy server built with Node.js and TypeScript. It provides a simple yet powerful way to route HTTP requests to different upstream servers based on configurable rules.

## Features

- **Simple Configuration**: YAML-based configuration for easy setup
- **Clustering Support**: Uses Node.js clustering to distribute load across multiple worker processes
- **Dynamic Routing**: Route requests to different upstream servers based on path patterns
- **Header Management**: Add custom headers to proxied requests
- **Mock Server**: Includes a configurable mock server for testing

## Installation

```bash
# Clone the repository
git clone https://github.com/DemonicAK/proxynova.git
cd proxynova

# Install dependencies
npm install
# or if using pnpm
pnpm install
```

## Configuration

ProxyNova uses YAML configuration files. Here's a basic example:

```yaml
server:
  listen: 8080           # Port to listen on
  workers: 4             # Number of worker processes

  upstreams:             # Define upstream servers
    - id: upstream1
      url: example.com
    - id: upstream2
      url: api.example.com

  headers:               # Custom headers to add
    - key: "x-forward-for"
      value: "$ip"
    - key: "Authorization"
      value: "Bearer xyz"

  rules:                 # Routing rules
    - path: /api
      upstreams:
        - upstream2
    - path: /
      upstreams:
        - upstream1
```

## Usage

### Build the project

```bash
npm run build
```

### Start the proxy server

```bash
npm start
```

### Development mode (with auto-reload)

```bash
npm run dev
```

### Running the mock server for testing

The project includes a mock server for testing without external services:

```bash
node dist/mock-server.js --config mock-server-config.yaml
```

## Project Structure

```
├── config.yaml               # Main proxy configuration
├── mock-server-config.yaml   # Mock server configuration
├── src/
│   ├── config-schema.ts      # Zod schema for config validation
│   ├── config.ts             # Configuration loader and parser
│   ├── index.ts              # Main entry point
│   ├── mock-server.ts        # Test server implementation
│   ├── server-schema.ts      # Schema for server messages
│   └── server.ts             # Proxy server implementation
├── package.json
└── tsconfig.json
```

## Development

This project uses:
- TypeScript for type safety
- Zod for configuration validation
- Express for the mock server implementation
- Commander for CLI argument parsing

## License

ISC License