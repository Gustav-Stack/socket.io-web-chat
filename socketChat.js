const express = require('express');
const { Socket } = require('node:dgram');
const { createServer, get } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);
var userCount = 0;
var users = [];
var rooms =[];
var messages = [
  {
    room: 'OLD',
    name: 'Gustavo',
    message: '<Mensagem do grupo OLD>:ola',
    date: '08:55:25'
  },
  {
    room: 'global',
    name: 'Gustavo',
    message: 'ola',
    date: '08:55:32'
  },
  {
    room: 'OLD',
    name: 'Gustavo',
    message: '<Mensagem do grupo OLD>:oi',
    date: '03:30:03'
  },
  {
    room: 'global',
    name: 'Ana',
    message: 'Oi, como vocês estão?',
    date: '10:15:45'
  },
  {
    room: 'OLD',
    name: 'Pedro',
    message: '<Mensagem do grupo OLD>: E aí pessoal!',
    date: '15:20:10'
  },
  {
    room: 'global',
    name: 'Maria',
    message: 'Bom dia a todos!',
    date: '09:45:55'
  }
];

var joined = []


//node socketChat.js -watch
//novo comando aprendido


app.use(express.static("public"));

//enviando o indexhtml
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
})

//executado quando o usuario se conecta ao servidor
io.on('connection', (socket) => {
  console.log('a user connected');
  io.emit('user count', users.length);

  const globalMessages = messages.filter((message) => message.room === "global");
  socket.emit('previous messages', globalMessages);
  let room = socket.id
  let name = "gameChat"
  let message = "Bem vindo ao servidor"
  
  date = new Date().toLocaleTimeString();
  
  

  //esse evento está sendo mandando pelo cliente e recebido no servidor onde irei armazenar o usuario 
  socket.on("user connected", (username) => {

    //faço um find simples para ver se o id ja está sendo usado caso esteja não armazeno o usuario
    const found = users.find((user) => user.id === socket.id);

    if (!found) {
      //coloco no array e envio o nome do usuario para os usuarios online
      users.push({ id: socket.id, username: username });
      
  io.to(socket.id).emit("chat message",name, message, date,room);
      //aqui e a parte em que estou lidando com a contagem de usuarios

      //criando um evento que envia a quantidade de usuario para todos os clientes
      io.emit('user count', users.length);
      io.emit("connected users", users);io.emit("room created", rooms);

    }

  })

  socket.on("room create", (room)=>{

    
    rooms.push(room)
    
    
    io.emit("room created", rooms);


  })


  console.log(messages);
  socket.on("join room", (room) => {
    socket.join(room);
  
    // includes is to verify if the array contains the socket id
    const idfound = joined.find((joiner) => {
      //comparing to see if the user is in the array joined
      return joiner.id === socket.id && joiner.room === room;
    });
  
    if (idfound) {
      return;
    } else {
      const id = socket.id;
      joined.push({ room, id });
      console.log(joined);
      const roomMessages = messages.filter((message) => message.room === room);
      socket.emit('previous messages', roomMessages);
    }
  });
  
  
  
  
  socket.on('room message', ({ selectedRoom, message }) => {
    console.log(selectedRoom);
  
    var name;
    const found = users.find((user) => socket.id === user.id);
  
    if (found) {
      var name = found.username;
      date = new Date().toLocaleTimeString();
      const room = selectedRoom;
  
      messages.push({ room, name, message, date });
      io.to(selectedRoom).emit('chat message', name, message, date,room);
    } else {
      console.error(404);
    }
  });
    
  socket.on('privateMessage', (data) => {
    const targetSocketId = data.targetSocketId;



    // Usar o método 'to' para enviar a mensagem apenas para o usuário alvo

    var name
    const found = users.find((user) => socket.id === user.id);

    if (found) {
      var name = found.username;
      date = new Date().toLocaleTimeString()
      let room = socket.id
      io.to([targetSocketId, socket.id]).emit('chat message', name, data.message, date,room);
    } else {
      console.error(404)
    }
  });

  socket.on("chat message", (msg) => {
    //procurando o usuario online  de acordo com seu id para envia o nome que ele cadastrou

    var name
    const found = users.find((user) => socket.id === user.id);
    if (found) {
      name = found.username;
      
      
      date = new Date().toLocaleTimeString()
      let room = "global";
      io.emit('chat message', name, msg, date, room);
      messages.push({room,name, message: msg, date });
    } else {

      console.error(404)
    }

  })



  socket.on('disconnect', () => {

    const disconnectedUser = users.find((user) => user.id === socket.id);

    //diminuindo o usuario que deslogou 

    if (disconnectedUser) {
      //fazendo um filter do array para retorna todos os usuario menos oq o id que desconectou
      users = users.filter((user) => user.id !== socket.id);
      userCount = users.length;
      //enviando as informações para o cliente
      io.emit('user count', userCount);
      io.emit('disconnected user', disconnectedUser.username);
    }
  });

});

server.listen(3000, () => {
  console.log("sever running on port 3000");
});

