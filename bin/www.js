/** Module dependencies.*/
const app = require("../app");
const http = require("http");
const mqtt = require("mqtt");
const config = require("../config/network");
const logColor = require("../src/untils/logColor");
const service = require("./services/services");
const convertData = require("./services/socket_data");
const utils = require("./services/utils");

const mqttConfig = require("../config/config").mqtt;
/** Get port from environment and store in Express.*/
let port = normalizePort(process.env.PORT || config.port);
app.set("port", port);

/** Create HTTP server.*/
let server = http.createServer(app);
const io = require("socket.io")(server);

const options = {
  username: mqttConfig.username,
  password: mqttConfig.password,
};

let client = mqtt.connect(mqttConfig.host, options);

let mess = 1;
/** MQTT connection.*/
client.on("connect", function () {
  client.subscribe("Sensors", function (err) {
    log.info("Connect to MQTT");
    if (err) throw err;
  });
  client.subscribe("statusDevice-1", { qos: 1 });
});
/** MQTT message.*/
client.on("message", async function (topic, message) {
  switch (topic) {
    case "Sensors":
      let data = JSON.parse(message);
      log.info(`Message in topic: Sensor`);
      let convert = convertDataSensors(data);
      await service.saveData(convert);
      log.info(convert);
      io.sockets.emit("sensorDevice-1", convert);
      break;
    case "statusDevice-1":
      log.info(`Message in topic: statusDevice-1`);
      log.info("Gửi trạng thái " + message);
      io.sockets.emit("statusDevice-1", message.toString());
      break;
    default:
      break;
  }
});

/** Socket.io connection.*/
io.on("connection", function (socket) {
  socket.on("controlDevice-1", async function (data) {
    // log.info(`New message controller: ${data}`);

    client.publish("control", data.toString());
  });
});

/** Listen on provided port, on all network interfaces.*/
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function convertDataSensors(inp) {
  return {
    Temp: inp.Temp,
    Humi: inp.Hum,
    Light: inp.Light,
    Station: inp.St,
  };
}

/** Normalize a port into a number, string, or false.*/
function normalizePort(val) {
  let port = parseInt(val, 10);
  if (isNaN(port)) return val; // named pipe
  if (port >= 0) return port; // port number
  return false;
}

/** Event listener for HTTP server "error" event.*/
function onError(error) {
  if (error.syscall !== "listen") throw error;
  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/** Event listener for HTTP server "listening" event.*/
function onListening() {
  let addr = server.address();
  let bind = typeof addr === "string" ? "pipe " + addr : addr.port;
  console.log(
    "Listening on " + logColor(`color:yellow${config.hostname}:${bind}`)
  );
}

console.log(
  logColor(`color:pink
███████╗ █████╗ ██████╗ ███╗   ███╗
██╔════╝██╔══██╗██╔══██╗████╗ ████║
█████╗  ███████║██████╔╝██╔████╔██║
██╔══╝  ██╔══██║██╔══██╗██║╚██╔╝██║
██║     ██║  ██║██║  ██║██║ ╚═╝ ██║
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝
`)
);
