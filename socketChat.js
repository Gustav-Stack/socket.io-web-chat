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
var messages = [];
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
  
  

  //esse evento está sendo mandando pelo cliente e recebido no servidor onde irei armazenar o usuario 
  socket.on("user connected", (username) => {

    //faço um find simples para ver se o id ja está sendo usado caso esteja não armazeno o usuario
    const found = users.find((user) => user.id === socket.id);

    if (!found) {
      //coloco no array e envio o nome do usuario para os usuarios online
      users.push({ id: socket.id, username: username });
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
  
    const found = users.find((user) => socket.id === user.id);
  
    //includes is to verify if the array contains the socket id
    const idfound = joined.includes(socket.id);
  
    if (idfound) {
      return;
    } else {
      joined.push(socket.id);
  
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
      io.to(selectedRoom).emit('chat message', name, message, date);
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
      
      io.to([targetSocketId, socket.id]).emit('chat message', name, data.message, date);
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
      io.emit('chat message', name, msg, date);
      room = "global";
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

