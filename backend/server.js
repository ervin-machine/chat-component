const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const axios = require("axios").default
const cors = require('cors');
const fs = require('fs')

dotenv.config();
const app = express();

app.use(express.json()); 
app.use(cors({
  origin: '*'
}));

const PORT = process.env.PORT;
const token = process.env.AUTH_MANAGEMENT_TOKEN

var options = {
  method: 'GET',
  url: 'https://dev-t3-qedh1.us.auth0.com/api/v2/users',
  headers: {authorization: `Bearer ${token}`}
};

let users = []

app.post('/messages', (req, res) => {
  const { messages } = req.body;
  const { id, content, fromUserId, status } = messages[messages.length - 1]

  const jsonString = JSON.stringify(messages)
  fs.writeFile('./data/messages.json', jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Success', 'Message sent from', messages[messages.length - 1].fromUserId, messages[messages.length - 1])
        console.log('Success', 'Message received', messages[messages.length - 1].toUserId, messages[messages.length - 1])
        console.log('Success', 'Notification sent', {id, fromUserId, content, status })
    }
})
})

app.post('/updateMessage', (req, res) => {
  const { id } = req.body;
  const jsonString = fs.readFileSync('./data/messages.json');

  const parsed = JSON.parse(jsonString)
  let updated;

  const update = parsed.map(el => {
    if(el.fromUserId === id) {
      updated = el
      return {...el, status: 'seen'}
    }
    return el
  })

  setTimeout(() => {
    fs.writeFile('./data/messages.json', JSON.stringify(update), err => {
      if (err) {
          console.log('Error writing file', err)
      } else {
        console.log("Success", "Message read", updated)
      }
  })
  }, 1000)
  
})

app.get('/messagesList', (req, res) => {
  const jsonString = fs.readFileSync('./data/messages.json');
  const messages = JSON.parse(jsonString);
  res.send(messages)
})

app.get('/notification/:to', (req, res) => {
  const jsonString = fs.readFileSync('./data/messages.json');
  const parsed = JSON.parse(jsonString)
  const getNotification = parsed.map(message => message.toUserId === req.params['to'] && message.status === "sent" ? { from: message.fromUserId, content: message.content, status: message.status, id: message.id } : null)
  res.send(getNotification)
})

app.post('/analytics', (req, res) => {
  
  console.log("success", req.body)
})

app.post('/sendmail', (req, res) => {
  console.log("Success" ,"Mail sent", req.body)
})


axios.request(options).then(function (response) {
  users = [...response.data];
  users = users.map(user => { return {...user, status: "Offline", isAuth: false, isTyping: false, hasNewMessage: false, mutedUsers: [], removedUsers: [], optionOpen: false, reportOpen: false, fetchedMessages: false } })
}).catch(function (error) {
  console.error(error);
});

console.log(users)

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.use((socket, next) => {
  const username = socket.handshake.auth.nickname;
  const id = socket.handshake.auth.sub;
  const picture = socket.handshake.auth.picture
  socket.username = username;
  socket.id = id

  const test = users.some(user => user.user_id === id)

  if(!test) {
    const newVal = [...users, {
      user_id: id,
      name: username,
      picture: picture,
      isAuth: false, 
      isTyping: false, 
      hasNewMessage: false, 
      mutedUsers: [], 
      removedUsers: [], 
      optionOpen: false, 
      reportOpen: false, 
      fetchedMessages: false
    }]

    users = newVal
  }

  const updateUser = users.map(user => {
    if(user.user_id === id) {
      return {...user, status: "Active"}
    }
    return user
  })

  users = [...updateUser]

  next();
});

io.on("connection", (socket) => {
  socket.emit("users", users);

  socket.broadcast.emit("user connected", users, socket.id);

  //socket.on("logged", (id) => socket.broadcast.emit("logged", users, id))

  socket.on("message received", ({ content, to, id }) => {
    console.log("Content:", content, " To:", to);
    socket.to(to).emit("message received", {
      id,
      content,
      from: socket.id,
    });
  });

  socket.on("message fetched", ({ to }) => {
    socket.to(to).emit("message fetched", {
      to: to,
      from: socket.id,
    });
  });

  socket.on("typing", ({to}) => socket.to(to).emit("typing", { from: socket.id }));
  socket.on("stop typing", ({to}) => socket.to(to).emit("stop typing", { from: socket.id }));
  socket.on('delete message', (id) => io.emit('delete message', id));
  socket.on('enable edit message', (id) => io.emit('enable edit message', id));
  socket.on('disable edit message', (id) => io.emit('disable edit message', id));
  socket.on('edit message', (id, content) => io.emit('edit message', id, content));
  socket.on("update status", (status, id) => io.emit('update status', status, id));
  socket.on("message status", (status, id) => io.emit('message status', status, id));

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData.su);
  });

});

