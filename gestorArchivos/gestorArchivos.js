
const socketClient = require('socket.io-client');
const fs = require('fs');
const { exit } = require('process');
const process = require('process');


const socket = socketClient('http://localhost:8000')
const cwd = '/home/drew/projects/kernel/gestorArchivos/'



socket.on('disconnect',()=>{
    exit();
})

setTimeout(function() {
    socket.emit('crear_proceso', { nombre: 'Gestor de Archivos', PID: process.pid });
}, 20000)


socket.on('crear_carpeta', (carpeta) => {
    if (!fs.existsSync(cwd + carpeta)) {

        try {
            fs.mkdirSync(carpeta);
            socket.emit('res_crear_carpeta', { nombre: carpeta, transaccion: `Carpeta '${carpeta}' creada exitosamente`})
        } catch (e) {
    
            socket.emit('res_crear_carpeta', { nombre: carpeta, error: `Error al crear carpeta '${carpeta}': ${e}`})
        }    
    } else {

        socket.emit('res_crear_carpeta', { nombre: carpeta, error: `Error al crear carpeta '${carpeta}': Carpeta ya existente`})
    }
})

socket.on('borrar_carpeta', (carpeta) => {

    if (fs.existsSync(cwd + carpeta)) {
        try {
            fs.rmSync(carpeta, { recursive: true, force: true });
            socket.emit('res_borrar_carpeta', { nombre: carpeta, transaccion: `Carpeta '${carpeta}' borrada exitosamente`})
        } catch (e) {
            socket.emit('res_borrar_carpeta', { nombre: carpeta, error: `Error al borrar carpeta '${carpeta}': ${e}`})
        }    
    } else {

        socket.emit('res_borrar_carpeta', { nombre: carpeta, error: `Error al borrar carpeta '${carpeta}': Carpeta no existente`})
    }
})

socket.on('crear_archivo', (archivo) => {

    if (fs.existsSync(cwd + archivo)) {
        socket.emit('res_crear_archivo', {
            nombre: archivo,
            error: `Error al crear archivo '${archivo}': archivo ya existente`
        })
    } else {
        fs.writeFile(cwd + archivo, '', function (err) {
            if (err) {
                socket.emit('res_crear_archivo', {
                    nombre: archivo,
                    error: `Error al crear archivo '${archivo}': ${err}`
                })
                return;
            };
            socket.emit('res_crear_archivo', {
                nombre: archivo,
                transaccion: `Archivo ${archivo} creado exitosamente`
            })
        });
    }
})

socket.on('borrar_archivo', (archivo) => {
    
    if (fs.existsSync(cwd + archivo)) {
        fs.unlink(archivo, function (err) {
            if (err) {
                
                socket.emit('res_borrar_archivo', { nombre: archivo, error: `Error al borrar archivo '${archivo}: ${err}'`})
                return;
            }
            socket.emit('res_borrar_archivo', { nombre: archivo, transaccion: `Archivo '${archivo}' borrado exitosamente`})
        })
    } else {
        socket.emit('res_borrar_archivo', { nombre: archivo, error: `Error al borrar archivo '${archivo}': Archivo ya existente`})
    }
})
