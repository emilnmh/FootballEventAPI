#!/usr/bin/env node

/**
 * Module dependencies.
 */
const app = require("./src/api");
const http = require("http");

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || 3001;
app.set("port", port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on("listening", onListening);

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}
