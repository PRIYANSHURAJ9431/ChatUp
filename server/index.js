// import WebSocket, { WebSocketServer } from "ws";
// const index = () => {};
// module.exports(index);

const WS = require("ws");
const express = require("express");
const path = require("path");

const app = express();

app.use("/", express.static(path.resolve(__dirname, "../client")));

const server = app.listen(9876);

const wss = new WS.WebSocketServer({
  // port: 9876,
  // server: server,
  // Not advisable to use verifyClient
  // verifyClient: (info) => {
  //   return true;
  // },
  noServer: true,
});

// WS maintains array of clients of its own also
const typingUsers = [];
const messages = [];
const allUsers = [];

function updateAllUsers(ws) {
  ws.send(
    JSON.stringify({
      event: "all_users",
      data: allUsers.map((userWS) => ({
        status: userWS._userDetails.status,
        user: userWS._userDetails.user,
      })),
    })
  );
}

function sendMessages(ws) {
  ws.send(
    JSON.stringify({
      event: "message_list",
      data: messages,
    })
  );
}

wss.on("connection", function (ws) {
  // ws.send("Hello");
  // clients.push(ws);
  // console.log(wss.clients.size);

  ws.on("message", function (message) {
    console.log("received: %s", message);
    try {
      const aa = JSON.parse(message);
      const event = aa.event;
      const data = aa.data;
      console.log(event);
      switch (event) {
        case "addTypingUsers": {
          typingUsers.push(ws);
          break;
        }

        case "removeTypingUsers": {
          const user = typingUsers.findIndex((user) => user === ws);
          if (user !== -1) {
            typingUsers.splice(user, 1);
          }
          break;
        }

        case "sendMessage": {
          messages.push(data.text);
          wss.clients.forEach((client) => {
            sendMessages(client);
          });
          break;
        }

        case "thisUser": {
          console.log("new");
          ws._userDetails = data;
          allUsers.push(ws);
          // updateAllUsers(ws);
          wss.clients.forEach((client) => {
            updateAllUsers(client);
          });
          break;
        }
      }
    } catch (err) {
      console.log(err);
    }

    // clients.forEach((client) => {
    //   client.send("from server :" + da);
    // });

    // wss.clients.forEach((client) => {
    //   if (client.readyState === WS.OPEN) {
    //     client.send("from server :" + da);
    //   }
    // });
  });
});

server.on("upgrade", async function upgrade(request, socket, head) {
  // if (Math.random() > 0.5) {
  //   return socket.end("HTTP/1.1 401 Unauthorized\r\n", "ascii");
  // }

  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit("connection", ws, request);
  });
});

console.log("hi");
