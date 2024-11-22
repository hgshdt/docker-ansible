"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_node_http = __toESM(require("node:http"));
var import_express = __toESM(require("express"));
var nodePty = __toESM(require("node-pty"));
var import_ws = __toESM(require("ws"));
const app = (0, import_express.default)();
const server = new import_node_http.default.Server(app);
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const staticDir = "./build";
app.use("/", import_express.default.static(staticDir));
const wss = new import_ws.default.Server({ server });
wss.on("connection", (ws) => {
  const pty = nodePty.spawn("bash", ["--login"], {
    name: "xterm-color",
    cols: 80,
    rows: 24
  });
  pty.onData((data) => {
    ws.send(JSON.stringify({ output: data }));
  });
  ws.on("message", (message) => {
    const m = JSON.parse(message.toString());
    if (m.input) {
      pty.write(m.input);
    } else if (m.resize) {
      pty.resize(m.resize[0], m.resize[1]);
    }
  });
});
server.listen(Number(process.env.PORT) || 8999, "0.0.0.0", () => {
  console.log(`Server started on ${JSON.stringify(server.address())} :)`);
});
