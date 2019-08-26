const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let history = [];
let users = [];
let allUsers = [];
let clients = [];

let BotFactory = require('./factory/factory');

const port = process.env.PORT || 8888;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/frontend.html');
});

app.get('/chat-frontend.js', (req, res) => {
  res.sendFile(__dirname + '/chat-frontend.js');
});

io.on('connection', socket => {
  let user = {};
  socket.on('login', data => {
    clients.push(socket.id, data.userNickName);
    users[socket.id] = data;
    user = data;
    allUsers.push(data);

    setTimeout(() => {
      for (let i in allUsers) {
        if ((allUsers[i].userName === users[socket.id].userName) && (allUsers[i].userNickName === users[socket.id].userNickName)) {
          allUsers[i].userStatus = 'online';
          io.emit('loadAll', allUsers);
        }
      }
    }, 60000);
  });

  socket.on('loadAll', data => {
    io.emit('loadAll', allUsers);
  });

  socket.on('chat message', msg => {
    let target = {};
    let proxyMessage = new Proxy(target, {});
    proxyMessage.msg = msg.message.toLowerCase();

    let messageToUser = false;
    for (let i in allUsers) {
      if (msg.message.indexOf(`@${allUsers[i].userNickName}`) != -1) {
        messageToUser = allUsers[i].userName;
      }
    }

    io.emit('chat message', { time: msg.date, message: msg.message, name: msg.adminName || user.userName, userNickName: msg.adminNickName || user.userNickName, changeBackground: messageToUser });
    history.push({ time: msg.date, message: msg.message, name: msg.adminName || user.userName, userNickName: msg.adminNickName || user.userNickName, changeBackground: messageToUser });

    if (history.length >= 100) {
      history.shift();
      io.emit('chat history', history);
    }

    if (proxyMessage.msg.indexOf('@bot') != -1) {
      const botFactory = new BotFactory();
      let bot = botFactory.create(proxyMessage.msg);

      setTimeout(() => {
        let time = new Date();
        let parseTime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

        io.emit('chat message', { time: parseTime, message: bot, name: 'bot', userNickName: 'bot', changeBackground: false });
        history.push({ time: parseTime, message: bot, name: 'bot', userNickName: 'bot', changeBackground: false });
      }, 2000);
    }
  });

  io.emit('chat history', history);

  socket.on('typing', data => {
    socket.broadcast.emit('typing', { data: data, user: user });
  });

  socket.on('disconnect', () => {
    for (let i in allUsers) {
      if (allUsers[i].userName === user.userName) {
        allUsers[i].userStatus = 'justLeft';
        io.emit('loadAll', allUsers);
      }
    }

    setTimeout(() => {
      for (let i in allUsers) {
        if (allUsers[i].userName === user.userName) {
          allUsers[i].userStatus = 'offline';
          io.emit('loadAll', allUsers);
        }
      }
    }, 60000);

    io.emit('disconnect', user);
  });
});

app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/' + 'style.css');
});

http.listen(port, () => {
  console.log('server is running on localhost:8888');
});