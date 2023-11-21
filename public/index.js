const socket = io();


const form = document.getElementById("form");
const input = document.getElementById("input");
userForm = document.getElementById("username-container");
userInput = document.getElementById("username-input");
const usersconnected = document.getElementById("users-online");

var username;
var targetSocketId;
var selectedRoom;


//função para selecionar usuario para qual sera eviada a mensagem
function changeColor(element, attribute) {
  element.addEventListener("click", (e) => {
    selectedRoom = null
    targetSocketId = null
    console.log(e.target.classList);
    if(e.target.classList[0] !== "title"){
    
      if(attribute === "roomid"){
        selectedRoom = e.target.textContent; 
        socket.emit("join room", selectedRoom);
      }else if(attribute === "userid"){
        targetSocketId = e.target.getAttribute(attribute);
      }
    
    }
    
    var allUserItems = roomsOnline.querySelectorAll("li");
    var allRoomItems = usersconnected.querySelectorAll("li");
    

    if(!allUserItems){
      return
    }

    allUserItems.forEach((userItem) => {
      userItem.style.background = "#c3c2c2";
    });
    allRoomItems.forEach((userItem) => {
      userItem.style.background = "#c3c2c2";
    });
    e.target.style.background = "#000000"
  })
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



createRoomButton.addEventListener("click", (e) => {
  if (username) {
    createRoom.classList.remove("hidden");
    form.classList.add('hidden');

  } else {
    alert("Faça login");
  }
});

createRoom.addEventListener("submit", (e) => {
  e.preventDefault()
  const inputRoom = document.getElementById("roomName")
  console.log(inputRoom.value);

  createRoom.classList.add("hidden");
  form.classList.remove('hidden');
  socket.emit("room create", inputRoom.value);

})





changeColor(usersconnected, "userid");

changeColor(roomsOnline, "roomid");

//emitindo a mensagem para o servidor
form.addEventListener("submit", (event) => {
  event.preventDefault();


  if (input.value && targetSocketId) {
    socket.emit('privateMessage', { targetSocketId: targetSocketId, message: "<private>:" + input.value })
    input.value = "";
    return;

  }
  else if (input.value && selectedRoom) {
    socket.emit('room message', { selectedRoom: selectedRoom, message: `<Mensagem do grupo ${selectedRoom}>:` + input.value })
    input.value = "";
    return;

  }
  else if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
}
);







//evento que e disparado caso algum usuario logue criando uma lista com esses usuarios
socket.on("connected users", (users) => {
  // Iterar sobre os usuários recebidos
  users.forEach((user) => {
    // Verificar se o usuário já está na lista
    const existingUser = Array.from(usersconnected.children).find(
      (userItem) => userItem.textContent === user.username
    );

    if (!existingUser) {
      // Se o usuário não estiver na lista, adicioná-lo
      const newUserItem = document.createElement("li");
      newUserItem.innerHTML = user.username + "<i class='fa-solid fa-user'></i>";
      newUserItem.setAttribute("userid", user.id);


      usersconnected.appendChild(newUserItem);
    }
  });
});
socket.on("room created", (rooms) => {
  // Iterar sobre os usuários recebidos
  rooms.forEach((room) => {
    // Verificar se o usuário já está na lista
    const existingRoom = Array.from(roomsOnline.children).find(
      (roomItem) => roomItem.textContent === room
    );

    if (!existingRoom) {
      // Se o usuário não estiver na lista, adicioná-lo
      const newRoomItem = document.createElement("li");

      newRoomItem.innerHTML = room + "<i class='fa-solid fa-people-group'></i>";
      const roomid = room + rooms.length
      newRoomItem.setAttribute("roomid", roomid);


      roomsOnline.appendChild(newRoomItem);
    }
  });
});



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

socket.on("chat message", (name, msg, date) => {
  const item = document.createElement("li");
  console.log(name, msg);
  item.textContent = name + ": " + msg + "" + date;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
})

socket.on('previous messages', (previousMessages) => {
  console.log(previousMessages);
  // Processar mensagens antigas, por exemplo, exibindo-as na interface do usuário
  previousMessages.forEach((message) => {
      const item = document.createElement("li");
      item.textContent = `${message.name}: ${message.message} ${message.date}`;
      messages.appendChild(item);
  });
});