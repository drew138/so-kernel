
const socketClient = require('socket.io-client');
const socket = socketClient('http://localhost:8000')

const { exit } = require('process');
const process = require('process');

const fs = require('fs');
var exec = require('child_process').exec;

socket.on('borrar_proceso', (PID) => {
    try {
      process.kill(PID)
      const content = `Proceso ${PID} terminado correctamente\n`
      socket.emit('res_borrar_proceso', { PID, transaccion: content })
      fs.writeFile('/home/drew/projects/kernel/log.txt', content, { flag: 'a' }, err => {});
    } catch (err) {
      const content = `Error al borrar proceso ${PID}.\n`
      socket.emit('res_borrar_proceso', { error: content })
      fs.writeFile('/home/drew/projects/kernel/log.txt', content, { flag: 'a' }, err => {});
    }
    }
)

setTimeout(() => {
    const content = 'Gestor de Procesos iniciado correctamente\n'
    socket.emit('crear_proceso', { nombre: 'Gestor de Procesos', PID: process.pid })
    fs.writeFile('/home/drew/projects/kernel/log.txt', content, { flag: 'a' }, err => {});
}, 15000)

const reactApp = exec('npm start', { cwd: '/home/drew/projects/kernel/client/' }, function(err, stdout, stderr) {});
setTimeout(() => {
    const content = 'Cliente iniciado correctamente\n'
    socket.emit('crear_proceso', { nombre: 'Cliente', PID: reactApp.pid  })
    fs.writeFile('/home/drew/projects/kernel/log.txt', content, { flag: 'a' }, err => {});
}, 20000)

if (Math.random() > 0.5) {
    setTimeout(() => {
        const nvim = exec('nvim hello.txt', function(err, stdout, stderr) {
        });
        
        setTimeout(() => {
            fs.writeFile('/home/drew/projects/kernel/log.txt', 'Nvim iniciado correctamente\n', { flag: 'a' }, err => {});
            socket.emit('crear_proceso', { nombre: 'Nvim', PID: nvim.pid })
        }, 20000)
    }
        , 10000 * Math.random())
} else {

    setTimeout(() => {
        fs.writeFile('/home/drew/projects/kernel/log.txt', 'Error al iniciar proceso Nvim\n', { flag: 'a' }, err => {});
        socket.emit('error_proceso', { nombre: 'Nvim', error: 'Error al iniciar proceso Nvim' })
    }, 20000)
}


if (Math.random() > 0.5) {
    const proc = exec('node gestorArchivos.js', { cwd: '/home/drew/projects/kernel/gestorArchivos/' }, function (err, stdout, stderr) {
    })
    
    setTimeout(function() {
        fs.writeFile('/home/drew/projects/kernel/log.txt', 'Gestor de Archivos iniciado correctamente\n', { flag: 'a' }, err => {});
        socket.emit('crear_proceso', { nombre: 'Gestor de Archivos', PID: proc.pid });
    }, 20000)
} else {
    setTimeout(function() {
        fs.writeFile('/home/drew/projects/kernel/log.txt', 'Error al iniciar proceso Gestor de Archivos\n', { flag: 'a' }, err => {});
        socket.emit('error_proceso', { nombre: 'Gestor de Archivos', error: 'Error al iniciar proceso Gestor de Archivos' });
    }, 20000)
}

socket.on('disconnect',()=>{
    exit();
})
