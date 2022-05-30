
const socketClient = require('socket.io-client');
const socket = socketClient('http://localhost:8000')

const { exit } = require('process');
const process = require('process');

var exec = require('child_process').exec;

socket.on('borrar_proceso', (PID) => {
        process.kill(PID)
    }
)

setTimeout(() => {
    socket.emit('crear_proceso', { nombre: 'Gestor de Procesos', PID: process.pid })
}, 15000)

const reactApp = exec('npm start', { cwd: '/home/drew/projects/kernel/client/' }, function(err, stdout, stderr) {
});

setTimeout(() => {
    socket.emit('crear_proceso', { nombre: 'Cliente', PID: reactApp.pid })
}, 20000)

const nvim = exec('nvim hello.txt', function(err, stdout, stderr) {
});

setTimeout(() => {
    socket.emit('crear_proceso', { nombre: 'Nvim', PID: nvim.pid })
}, 20000)

exec('node gestorArchivos.js', { cwd: '/home/drew/projects/kernel/gestorArchivos/' }, function (err, stdout, stderr) {
})


socket.on('disconnect',()=>{
    exit();
})
