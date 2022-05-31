const express = require("express")
const socketIo = require("socket.io")
const http = require("http")
const process = require('process');
const PORT = process.env.PORT || 8000
const app = express()

var exec = require('child_process').exec;
const server = http.createServer(app)


const fs = require('fs');

setTimeout(() => {
    const content = 'Kernel iniciado correctamente'
    io.emit('crear_proceso', { nombre: 'Kernel', PID: process.pid })
    fs.writeFile('/home/drew/projects/kernel/log.txt', content, { flag: 'a' }, err => {});
}, 15000)

fs.writeFile('/home/drew/projects/kernel/log.txt', 'Kernel iniciado correctamente\n', { flag: 'a' }, err => {});

const io = socketIo(server, { 
  cors: {
    origin: "http://localhost:3000"
    }
  }) //in case server and client run on different urls
  

exec('node index.js', { cwd: '/home/drew/projects/kernel/gestorProcesos/' }, function(err, stdout, stderr) {
  console.log(stdout)
});

  setTimeout(() => {
    io.emit('crear_proceso', { nombre: 'Kernel', PID: process.pid })
  }, 15000)
  
io.on("connection",(socket)=>{
  console.log("client connected: ",socket.id)
  
  // socket.join("clock-room")
  
  socket.on('borrar_proceso', (data) => {
    console.log(data)
    io.emit('borrar_proceso', data)
  })
  socket.on('crear_carpeta', (data) => {
    console.log(data)
    io.emit('crear_carpeta', data);
  })
  
  socket.on('borrar_carpeta', (data) => {
    console.log(data)
    io.emit('borrar_carpeta', data);
  })
  socket.on('crear_archivo', (data) => {
    console.log(data)
    io.emit('crear_archivo', data);
  })
  socket.on('borrar_archivo', (data) => {
    console.log(data)
    io.emit('borrar_archivo', data);
  })
  socket.on('res_crear_carpeta', (data) => {
    console.log(data)
    io.emit('res_crear_carpeta', data);
  })
  socket.on('res_borrar_carpeta', (data) => {  
    console.log(data)
    io.emit('res_borrar_carpeta', data);
  })
  socket.on('res_crear_archivo', (data) => {
    console.log(data)
    io.emit('res_crear_archivo', data);
  })
  socket.on('res_borrar_archivo', (data) => {
    console.log(data)
    io.emit('res_borrar_archivo', data);
  })
  socket.on('crear_proceso', (data) => {
    console.log(data)
    io.emit('crear_proceso', data);
  })
  socket.on('error_proceso', (data) => {
    console.log(data)
    io.emit('error_proceso', data);
  })

  socket.on("disconnect",(reason) => {
    console.log(reason)
  })

})

server.listen(PORT, err=> {
  if(err) console.log(err)
  console.log("Server running on Port ", PORT)
})


// log archivos
// num aleatorio proce/error
// 