const socket = io();


const form = document.getElementById("form");
const input = document.getElementById("input");
const userForm = document.getElementById("username-container");
const userInput = document.getElementById("username-input");
const usersconnected = document.getElementById("users-online");

var username;
var targetSocketId;
var selectedRoom;
var newMessagesNotification = []





//função para selecionar usuario para qual sera eviada a mensagem
function selectRoom(element, attribute) {
  element.addEventListener("click", (e) => {
    selectedRoom = null;
    targetSocketId = null;

    if (e.target.classList[0] !== "title") {
      if (attribute === "roomid") {
        selectedRoom = e.target.textContent;
        socket.emit("join room", selectedRoom);
      } else if (attribute === "userid") {
        targetSocketId = e.target.getAttribute(attribute);
      }
    }
    const buttonClicked = selectedRoom || targetSocketId || "global";


    newMessagesNotification = newMessagesNotification.filter((message) => {
      return message !== buttonClicked;
    });

    console.log(newMessagesNotification);

    setVisibility(buttonClicked);
    setColor(e);

  });
}

function setColor(e) {
  var allUserItems = roomsOnline.querySelectorAll("li");
  var allRoomItems = usersconnected.querySelectorAll("li");
  var allItems = Array.from(allUserItems).concat(Array.from(allRoomItems))
  if (!allItems) {
    return;
  }
  if (e.target.tagName === "LI") {
    allItems.forEach((item) => {
      item.style.background = "#c3c2c2";
      item.style.color = "#5640ff";
    });

    e.target.style.background = "rgb(14 14 14)";
    e.target.style.color = "#fff";

    if (targetSocketId === socket.id) {
      e.target.style.backgroundColor = "#808080";

      targetSocketId = null;
    }
  }

}

function setVisibility(buttonClicked) {
  const selectingMessages = messages.querySelectorAll("li");
  selectingMessages.forEach((message) => {
    let local = message.getAttribute("from");
    message.classList.remove('hidden');

    if (buttonClicked !== local) {
      message.classList.add('hidden');
    }
  });
}



// Solicitando o nome de usuário
userForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (userInput.value) {
    username = userInput.value;

    form.classList.remove('hidden');
    userForm.classList.add('hidden');
    socket.emit("user connected", username)
  }
});



//Room Creation
const createRoomButton = document.getElementById("create-room");
const createRoom = document.getElementById("room-form");
const roomsOnline = document.getElementById("rooms-online");


//mostrando formulario ao clicar em criar sala
createRoomButton.addEventListener("click", () => {
  if (username) {
    createRoom.classList.remove("hidden");
    form.classList.add('hidden');

  } else {
    alert("Faça login");
  }
});

//emitindo a sala para o backend
createRoom.addEventListener("submit", (e) => {
  e.preventDefault()
  const inputRoom = document.getElementById("roomName")
  console.log(inputRoom.value);

  createRoom.classList.add("hidden");
  form.classList.remove('hidden');
  socket.emit("room create", inputRoom.value);

})

//chamando função que seleciona qual vai ser a sala e manda o evento para chamar as mensagens
selectRoom(usersconnected, "userid");
selectRoom(roomsOnline, "roomid");

//emitindo a mensagem para o servidor
form.addEventListener("submit", (event) => {
  console.log(targetSocketId);
  console.log(selectedRoom);
  event.preventDefault();
  if (input.value) {
    if (targetSocketId) {
      socket.emit('privateMessage', { targetSocketId: targetSocketId, message: "<private>:" + input.value })
    }
    else if (selectedRoom) {
      socket.emit('room message', { selectedRoom: selectedRoom, message: `<Mensagem do grupo ${selectedRoom}>:` + input.value })
    } else {
      socket.emit("chat message", input.value);
    }
  }
  input.value = "";
}
);


//função para deixar os itens com mensagens não lidas verde so funciona para mensagens privadas
function verifyNotifications() {
  for (let i = 0; i < newMessagesNotification.length; i++) {
    const currentMessage = newMessagesNotification[i];
    console.log(currentMessage);

    const users = usersconnected.children;
    const rooms = roomsOnline.children;
    Array.from(rooms).forEach((room) => {
      const roomid = room.getAttribute("room");
      if (currentMessage === roomid) {
        room.style.color = "green";
      }
    })
    Array.from(users).forEach((user) => {
      const userId = user.getAttribute("userid");
      console.log(userId);

      if (currentMessage === userId) {
        user.style.color = "green";
      }
    });
  }


}



function addToList(names, listName) {
  names.forEach((name) => {
    const existingName = Array.from(listName.children).find((nameItem) => {
      if (usersconnected === listName) {
        return nameItem.textContent === name.username;
      } else {
        return nameItem.textContent === name;
      }
    });

    if (!existingName) {
      var newNameItem = document.createElement("li");

      if (usersconnected === listName) {
        newNameItem.innerHTML = name.username + "<i class='fa-solid fa-user'></i>";
        newNameItem.setAttribute("userid", name.id);
      } else {
        newNameItem.innerHTML = name + "<i class='fa-solid fa-people-group'></i>";
        const roomid = name + name.length;
        newNameItem.setAttribute("roomid", roomid);
      }

      listName.appendChild(newNameItem);

      console.log(verifyNotifications());
    }
  });
}


socket.on("connected users", (users) => {
  addToList(users, usersconnected)
})

socket.on("room created", (rooms) => {
  addToList(rooms, roomsOnline)
})




//o mesmo de cima so que agora para remover o usuario

socket.on('disconnected user', (disconnectedUsername) => {
  //procurando o li que está com o nome do usuario desconectado
  const userItem = Array.from(usersconnected.children).find(
    (user) => user.textContent === disconnectedUsername
  );

  if (userItem) {
    //removendo o usuario 
    usersconnected.removeChild(userItem);
  }
});

//criando uma contagem de usuario
socket.on("user count", (userCount) => {
  document.getElementById("user-count").textContent = userCount;
})


socket.on("chat message", (name, msg, date, room) => {

  const item = document.createElement("li");
  console.log(name, msg);
  item.innerHTML = `<div class="mensagem-li"><div>${name}: ${msg} </div><div>${date}</div></div>`;
  item.setAttribute("from", room)
  if (!newMessagesNotification.includes(room)) {
    newMessagesNotification.push(room)
  }
  console.log(newMessagesNotification);
  verifyNotifications();

  messages.appendChild(item);


  window.scrollTo(0, document.body.scrollHeight);
})



socket.on('previous messages', (previousMessages) => {
  console.log(previousMessages);

  // Processa mensagens antigas
  previousMessages.forEach((message) => {
    const item = document.createElement("li");
    item.innerHTML = `<div class="mensagem-li"><div>${message.name} : ${message.message}  </div><div>${message.date}</div></div>`;

    item.setAttribute("from", message.room)
    messages.appendChild(item);
  });

});

