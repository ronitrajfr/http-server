import * as net from "net";
import * as fs from "fs";
import * as pathModule from "path";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    //socket.write("HTTP/1.1 200 OK\r\n\r\n");
    const requestData = data.toString();
    console.log(requestData);
    const requestLine = requestData.split("\r\n")[0];
    const headers = requestData.split("\r\n").slice(1);

    const headerMap: Record<string, string> = {};
    for (const header of headers) {
      if (header.includes(": ")) {
        const [key, value] = header.split(": ");
        headerMap[key.toLowerCase()] = value;
      }
    }
    const userAgent = headerMap["user-agent"];
    console.log(userAgent);
    const [method, path, version] = requestLine.split(" ");

    if (path.startsWith("/echo/")) {
      const pathParts = path.split("/");
      const lastSegment = pathParts[pathParts.length - 1] || "";

      let extension;
      if (lastSegment.includes(".")) {
        extension = lastSegment.split(".").pop() as string;
      }

      const mimeTypes: Record<string, string> = {
        txt: "text/plain",
        html: "text/html",
        json: "application/json",
        png: "image/png",
      };

      const contentType =
        extension && mimeTypes[extension] ? mimeTypes[extension] : "text/plain";

      const length = lastSegment.length;
      const responseStructure = `HTTP/1.1 200 OK\r\nContent-Type: ${contentType}\r\nContent-Length: ${length}\r\n\r\n${lastSegment}`;
      console.log(contentType, length, lastSegment);

      socket.write(responseStructure);
    } else if (path == "/user-agent") {
      const contentLength = userAgent.length;
      const res = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${contentLength}\r\n\r\n${userAgent}`;
      socket.write(res);
    } else if (path === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else if (path.startsWith("/files/")) {
      const directoryIndex = process.argv.indexOf("--directory");
      const baseDir =
        directoryIndex !== -1 ? process.argv[directoryIndex + 1] : "";
      const filename = path.replace("/files/", "");
      const filePath = pathModule.join(baseDir, filename);
      if (method == "POST") {
        const body = requestData.split("\r\n\r\n")[1];
        console.log(requestData);
        console.log(body);
        fs.writeFile(filePath, body, (err) => {
          if (err) {
            socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
          } else {
            socket.write("HTTP/1.1 201 Created\r\n\r\n");
          }
        });
      }

      fs.readFile(filePath, (err, fileData) => {
        if (err) {
          console.log(err);
          socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        } else {
          const length = fileData.length;
          socket.write(
            `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${length}\r\n\r\n`
          );
          socket.write(fileData as Uint8Array);
        }
      });
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
  });
  socket.on("close", () => {
    socket.end();
  });
});

server.listen(4221, "localhost");
