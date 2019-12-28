// DEPENDENCIES

const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");
const moment = require("moment");
const uuid = require("uuid");

// 1. Build services (these are formed as classes)
// Idea Service

class IdeaService {
  constructor() {
    this.ideas = [];
  }

  async find() {
    return this.ideas;
  }

  //   takes data from client
  async create(data) {
    const idea = {
      id: uuid.v4(),
      text: data.text,
      tech: data.tech,
      viewer: data.viewer
    };

    idea.time = moment().format("h:mm:ss a");
    this.ideas.push(idea);

    return idea;
  }
}

// Express init
const app = express(feathers());
const PORT = process.env.PORT || 6900;

// MIDDLEWARE
app.use(express.json());

// SOCKET.IO SETUP
app.configure(socketio());

// ENABLE REST SERVICES
app.configure(express.rest());

// REGISTER SERVICES
app.use("/ideas", new IdeaService());

// 2. Connect to channels 'stream' on new connection
app.on("connection", connection => app.channel("livestream").join(connection));

// Publish events
app.publish(data => app.channel("livestream"));

app
  .listen(PORT)
  .on("listening", () =>
    console.log(`Realtime server now up and running on port #${PORT}`)
  );

// app.service("ideas").create({
//   text: "Build a Flutter app",
//   tech: "Flutter",
//   viewer: "Grouper"
// });
