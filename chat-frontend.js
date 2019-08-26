(() => {
  const logInForm = document.getElementById('logInForm');
  const main = document.getElementById('main');
  const content = document.getElementById('content');
  const message = document.getElementById('inputText');
  const send = document.getElementById('sendBtn');
  const status = document.getElementById('status');
  const startFormBtn = document.getElementById('logInFormBtn');
  const userName = document.getElementById('userName');
  const userNickName = document.getElementById('userNickName');
  const userInformation = document.getElementById('usersPanel');
  const socket = io.connect();
  let timeout;
  let typing = false;

  startFormBtn.onclick = () => startFormBtnByClick();

  userNickName.onkeypress = e => {
    if (13 == e.keyCode) {
      startFormBtnByClick();
    }
  }

  function startFormBtnByClick() {
    if (userName.value && userNickName.value) {
      logInForm.style.display = 'none';
      main.style.display = 'flex';

      const user = {
        userName: userName.value,
        userNickName: userNickName.value,
        userStatus: 'justAppeared'
      };

      const time = new Date();
      const parseTime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

      socket.emit('chat message', { date: parseTime, message: ` new user ${userName.value} (@${userNickName.value}) connected`, adminName: "admin", adminNickName: "admin", changeBackground: false });
      socket.emit('login', user);
      socket.emit('loadAll', 'get all');
    } else {
      alert('please write name and Nick name');
    }
  }

  sendBtn.onclick = () => sendToChat();

  message.onkeypress = e => {
    if (13 == e.keyCode) {
      sendToChat();
    }
  }

  function sendToChat() {
    const time = new Date();
    const parseTime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
    const data = {
      message: message.value,
      date: parseTime
    };
    message.value = '';
    socket.emit('chat message', data);
  };

  socket.on('loadAll', data => {
    while (userInformation.firstChild) {
      userInformation.removeChild(userInformation.firstChild);
    }

    for (let i in data) {
      const color = document.createElement('i');
      color.id = data[i].userName;
      color.className = data[i].userStatus;

      const information = document.createElement('p');
      information.innerHTML = `<span class = "status"> ${data[i].userStatus} </span> ${data[i].userName} (@${data[i].userNickName})`;

      const wrapper = document.createElement('div');
      wrapper.appendChild(color);
      wrapper.appendChild(information);
      userInformation.appendChild(wrapper);
    }
  });

  socket.on('disconnect', data => {
    const time = new Date();
    const parseTime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
    if (data.userName) {
      socket.emit('chat message', { date: parseTime, message: "user " + data.userName + " diconnected", adminName: "admin", adminNickName: "admin", changeBackground: false });
    }
  });

  socket.on('chat history', function (msg) {
    let paras = document.getElementsByClassName('message');
    for (let i in paras) {
      paras[i].innerHTML = '';
    }

    for (let i in msg) {
      let element = document.createElement('p');
      if (msg[i].changeBackground === msg[i].userName) {
        element.style.backgroundColor = "#FFED5A";
      }
      element.innerHTML = `<span>${msg[i].time}</span> <span>${msg[i].name} (@${msg[i].userNickName})</span> <span>${msg[i].message}</span>`;
      element.className = 'message';
      content.insertBefore(element, status);
    }
  });

  socket.on('chat message', msg => {
    let element;
    if (msg.message) {
      element = document.createElement('p');
      element.className = 'message';
      if (msg.changeBackground == msg.userName) {
        element.style.backgroundColor = "#FFED5A";
      }
      element.innerHTML = `<span>${msg.time}</span> <span>${msg.name} (@${msg.userNickName})</span> <span>${msg.message}</span>`;
      content.insertBefore(element, status);
      scrollToBottom(content);
    }
  });

  function timeoutFunction() {
    typing = false;
    socket.emit('typing', false);
  }

  function scrollToBottom(el) {
    el.scrollTop = el.scrollHeight;
  }

  message.onkeyup = () => {
    typing = true;
    socket.emit('typing', 'typing...');
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 2000);
  };

  socket.on('typing', data => {
    if (data.data) {
      status.innerHTML = `@${data.user.userNickName} is typing …`;
    } else {
      status.innerHTML = '';
    }
  });
})();