const http=require("http");
const express=require("express");
const cors =require("cors"); 
const socketIO = require("socket.io");

const app=express();

var port = process.env.PORT||4000;

const users=[{}];

app.use(cors());

app.get("/",(req,res)=>{
    res.send("hello its woring ");
})

const server=http.createServer(app);
 
const io=socketIO(server);
 
io.on("connection",(socket)=>{
    console.log("new connection");
    socket.on('joined',({user})=>{
        users[socket.id]=user;
        console.log(user +' has joined');

    })  
    socket.emit('welcome',{user:"Admin",message:`welcome to the chat`})
    
    socket.broadcast.emit('userJoined',{user:"Admin",message:`User has joined`})

    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:`User has left`})
        console.log(`User let`)
    })
    socket.on('message',({message,id})=>{
      io.emit('sendMessage',{user:users[id],message,id })
    })


});

server.listen(port,()=>{
     console.log(`server is working on ${port}`);
})