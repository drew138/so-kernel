const express = require("express")
const socketIo = require("socket.io")
const http = require("http")
const PORT = process.env.PORT || 8000
const app = express()
const server = http.createServer(app)

const io = socketIo(server,{ 
    cors: {
      origin: "http://localhost:3000"
    }
}) //in case server and client run on different urls

io.on("connection",(socket)=>{
  console.log("client connected: ",socket.id)
  
  // socket.join("clock-room")
  
  socket.on('borrar_proceso', (PID) => {
    
    try {
      process.kill(PID)
      socket.emit('res_borrar_proceso', { PID, transaccion: `Proceso ${PID} terminado correctamente` })
    } catch (err) {
      socket.emit('res_borrar_proceso', { error: `Error al borrar proceso ${PID}.` })
    }
  })
  socket.on('crear_carpeta', (data) => {
    io.emit('crear_carpeta', data);
  })
  
  socket.on('borrar_carpeta', (data) => {
    io.emit('borrar_carpeta', data);
  })
  
  socket.on('crear_archivo', (data) => {
    io.emit('crear_archivo', data);
  })
  
  socket.on('borrar_archivo', (data) => {
    io.emit('borrar_archivo', data);
  })
  
  
  socket.on('res_crear_carpeta', (data) => {
    io.emit('res_crear_carpeta', data);
  })
  
  socket.on('res_borrar_carpeta', (data) => {  
    io.emit('res_borrar_carpeta', data);
  })
  
  socket.on('res_crear_archivo', (data) => {
    io.emit('res_crear_archivo', data);
  })
  
  socket.on('res_borrar_archivo', (data) => {
    io.emit('res_borrar_archivo', data);
  })
  socket.on("disconnect",(reason) => {
    console.log(reason)
  })

})


// setInterval(()=>{
//      io.emit("time", new Date())
// }, 1000)

server.listen(PORT, err=> {
  if(err) console.log(err)
  console.log("Server running on Port ", PORT)
})
