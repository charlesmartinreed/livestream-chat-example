let video = document.getElementById("webcam-stream");

let constraints = {
  audio: false,
  video: {
    width: { min: 480 },
    height: { min: 640 }
  }
};

window.addEventListener("DOMContentLoaded", async () => {
  let stream = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
  } catch (err) {
    console.error(err);
  }
});

// SOCKET SETUP
const socket = io("http://localhost:6900");

// FEATHERS SETUP
const app = feathers();

// THIS ENABLES SOCKET.IO TO SPEAK TO THE SERVER
app.configure(feathers.socketio(socket));

// SUBMIT LISTENER
document.getElementById("form").addEventListener("submit", submitIdea);

async function submitIdea(e) {
  console.log("submit triggered");
  e.preventDefault();

  //   grab data from form
  let text = document.getElementById("idea-text").value;
  let tech = document.getElementById("idea-tech").value;
  let viewer = document.getElementById("idea-viewer").value;

  //   Create new Idea in Feathers
  //   Note: The time stamping occurs on the backend
  app.service("ideas").create({
    text,
    tech,
    viewer
  });

  text = "";
  tech = "";
  viewer = "";
}

function renderIdea(idea) {
  // be sure to append with +=
  document.getElementById("ideas").innerHTML += `
  <div class="card bg-secondary my-3">
  <div class="card-body">
    <p class="lead">
      ${idea.text} <strong>(${idea.tech})</strong>
      <br />
      <em>Submitted by ${idea.viewer}</em>
      <br />
      <small>${idea.time}</small>
    </p>
  </div>
</div>
  `;
}

// Initializer method
async function init() {
  const ideas = await app.service("ideas").find();

  //   Add existing ideas to list
  ideas.forEach(renderIdea);

  //   Add idea to DOM in realtime
  app.service("ideas").on("created", renderIdea);
}

init();
