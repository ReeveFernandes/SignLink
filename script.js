var room_id;
var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;
var local_stream;
var screenStream;
var peer = null;
var currentPeer = null;

function createRoom() {
  room_id = uuidv4();
  room_el = document.getElementById("room-input");
  room_el.value = room_id;
  join_button = document.getElementById("join-button");
  peer = new Peer(room_id);
  peer.on("open", (id) => {
    overlay(`Peer Connected with ID: ${id}`);
    getUserMedia(
      { video: { width: 1280, height: 720 }, audio: true },
      (stream) => {
        local_stream = stream;
        setLocalStream(local_stream);
      },
      (err) => {
        console.log(err);
      }
    );
    overlay("Waiting for your friend to join!");
  });

  join_button.textContent = "Leave Room";
  join_button.onclick = () => window.location.reload();

  peer.on("call", (call) => {
    call.answer(local_stream);
    call.on("stream", (stream) => {
      setRemoteStream(stream);
    });
    currenPeer = call;
  });
}

function overlay(msg) {
  overlay_el = document.getElementById("overlay");
  overlay_text = document.getElementById("overlay-text");
  overlay_text.textContent = msg;
  overlay_el.hidden = false;
  setTimeout(() => {
    overlay_el.hidden = true;
  }, 3000);
}

function setLocalStream(stream) {
  let video = document.getElementById("local-video");
  video.srcObject = stream;
  video.muted = true;
  video.play();
}

function setRemoteStream(stream) {
  let video = document.getElementById("remote-video");
  video.srcObject = stream;
}

function joinRoom() {
  join_button = document.getElementById("join-button");
  overlay("Joining Room");
  let room = document.getElementById("room-input").value;
  if (room == " " || room == "") {
    alert("Please enter room number");
    return;
  }
  room_id = room;
  peer = new Peer();
  peer.on("open", (id) => {
    console.log("Connected with Id: " + id);
    getUserMedia(
      { video: true, audio: true },
      (stream) => {
        local_stream = stream;
        setLocalStream(local_stream);
        overlay("Joining peer");
        let call = peer.call(room_id, stream);
        call.on("stream", (stream) => {
          setRemoteStream(stream);
        });
        currentPeer = call;
      },
      (err) => {
        console.log(err);
      }
    );
  });
  join_button.textContent = "Leave Room";
  join_button.onclick = () => window.location.reload();
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
