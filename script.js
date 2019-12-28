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
