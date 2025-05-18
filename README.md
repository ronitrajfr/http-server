# Simple HTTP Server

A lightweight HTTP server implementation built with Node.js and TypeScript that handles basic HTTP requests.

## Overview

This server is a minimalistic implementation of HTTP protocol handling, capable of:

- Serving static responses
- Echoing content from URL paths
- Responding with the client's User-Agent
- Basic file operations (reading and writing)

## Features

- Basic HTTP Response: Returns a 200 OK status code for requests to the root path (/)
- Echo Service: Echoes content from URL path with proper content types (/echo/{content})
- User-Agent Information: Returns the client's User-Agent header (/user-agent)
- File Operations: Supports reading and writing files (/files/{filename})
  - GET: Retrieve file contents
  - POST: Create or update files

## Requirements

- Node.js (v14.x or later recommended)
- TypeScript

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ronitrajfr/http-server.git
   cd http-server
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

## Usage

Start the server with an optional directory for file operations:

```bash
bun run dev --directory <path-to-directory>
```

The server will listen on localhost port 4221.

## API Endpoints

### Root (/)

- Method: GET
- Description: Returns a 200 OK response
- Response: Empty body with 200 OK status

### Echo (/echo/{content})

- Method: GET
- Description: Echoes the content from the URL path
- Response: Content from URL with appropriate Content-Type
- Example: /echo/hello returns "hello"
- Content Types:
  - Default: text/plain
  - .html extension: text/html
  - .json extension: application/json
  - .png extension: image/png

### User-Agent (/user-agent)

- Method: GET
- Description: Returns the User-Agent header from the request
- Response: User-Agent string with text/plain Content-Type

### Files (/files/{filename})

- Methods: GET, POST
- Description: Read or write files in the specified directory
- GET Response: File contents with application/octet-stream Content-Type
- POST Request: File content in request body
- POST Response: 201 Created on success
- Notes: Requires the --directory parameter when starting the server

## Error Handling

- 404 Not Found: Returned for non-existent routes or files
- 405 Method Not Allowed: Returned for unsupported HTTP methods
- 500 Internal Server Error: Returned for file operation failures

## Implementation Details

The server implements HTTP request parsing from scratch:

- Parses request line and headers from raw TCP socket data
- Handles request routing based on path and method
- Manages appropriate content types and response formats
- Processes file operations asynchronously

## Examples

### Echo Example

```bash
curl -v http://localhost:4221/echo/hello
```

Response:

```http
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 5

hello
```

### File Upload Example

```bash
curl -v -X POST -d 'Hello, File!' http://localhost:4221/files/test.txt
```

Response:

```http
HTTP/1.1 201 Created
```

### File Retrieval Example

```bash
curl -v http://localhost:4221/files/test.txt
```

Response:

```http
HTTP/1.1 200 OK
Content-Type: application/octet-stream
Content-Length: 12

Hello, File!
```

## License

[MIT](LICENSE)
