WebSocket.prototype.emit = function (event, data) {
  this.send(JSON.stringify({ event, data }));
};

WebSocket.prototype.listen = function (eventName, callback) {
  this._socketListeners = this._socketListeners || {};
  //   this._socketListeners[eventName] = this._socketListeners[eventName] || [];
  //   this._socketListeners[eventName].push(callback);
  this._socketListeners[eventName] = callback;
};

const url = `ws://127.0.0.1:9876/`;

const server = new WebSocket(url);

const username = document.getElementById("currUser");

const userSection = document.getElementById("userSection");
const user = document.getElementById("userName");
const submit = document.getElementById("userSubmit");

const chatSection = document.getElementById("chatSection");
const message = document.getElementById("messages");
const input = document.getElementById("input");
const button = document.getElementById("send");

const listUsers = document.getElementById("listUsers");
const listMessages = document.getElementById("listMessages");


chatSection.style.display = "none";

button.disabled = true;

server.onopen = function (event) {
  button.disabled = false;
};

let currUserName = "";

server.onmessage = function (message) {
  try {
    const { event, data } = JSON.parse(message.data);
    server._socketListeners[event](data);
  } catch (error) {}
};

input.addEventListener("keyup", function () {
  if (!input.value) {
    server.emit("removeTypingUsers");
  } else {
    server.emit("addTypingUsers");
  }
});

button.addEventListener(
  "click",
  function (event) {
    const text = input.value;
    server.emit("sendMessage", { text });
    input.value = "";
    server.emit("removeTypingUsers");
  },
  false
);

submit.addEventListener(
  "click",
  function (event) {
    const currUser = user.value;
    if (currUser) {
      currUserName = currUser;
      server.emit("thisUser", { user: currUser, status: "green" });
      user.value = "";
      username.innerHTML=currUser;
      userSection.style.display = "none";
      chatSection.style.display = "block";
    } else {
      console.log("Enter a valid username");
    }
  },
  false
);

server.listen("all_users", function (data) {
  listUsers.innerHTML = "";
  console.log("Hi", data);
  data.forEach((element) => {
    const user = document.createElement("div");
    user.innerText = element.user;
    listUsers.appendChild(user);
  });
});

server.listen("message_list", function (data) {
  listMessages.innerHTML = "";
  console.log("messages", data);
  data.forEach((element) => {
    const message = document.createElement("div");
    message.innerText = element;
    listMessages.appendChild(message);
  });
});
