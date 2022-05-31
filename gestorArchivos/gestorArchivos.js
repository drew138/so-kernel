
const socketClient = require('socket.io-client');
const fs = require('fs');
const { exit } = require('process');


const socket = socketClient('http://localhost:8000')
const cwd = '/home/drew/projects/kernel/gestorArchivos/'



socket.on('disconnect',()=>{
    exit();
})

socket.on('crear_carpeta', (carpeta) => {
    if (!fs.existsSync(cwd + carpeta)) {

        try {
            fs.mkdirSync(carpeta);
            const content = `Carpeta '${carpeta}' creada exitosamente\n`
            socket.emit('res_crear_carpeta', { nombre: carpeta, transaccion: content })
            fs.writeFile('/home/drew/projects/kernel/log.txt', content, { flag: 'a' }, err => {});
        } catch (e) {
            const content = `Error al crear carpeta '${carpeta}': ${e}\n`
            socket.emit('res_crear_carpeta', { nombre: carpeta, error: content})
            fs.writeFile('/home/drew/projects/kernel/log.txt', content, { flag: 'a' }, err => {});
        }    
    } else {
        const content = `Error al crear carpeta '${carpeta}': Carpeta ya existente\n`
        socket.emit('res_crear_carpeta', { nombre: carpeta, error: content})
        fs.writeFile('/home/drew/projects/kernel/log.txt', content, { flag: 'a' }, err => {});
    }
})

socket.on('borrar_carpeta', (carpeta) => {

    if (fs.existsSync(cwd + carpeta)) {
        try {
            fs.rmSync(carpeta, { recursive: true, force: true });
            const content = `Carpeta '${carpeta}' borrada exitosamente\n`
            socket.emit('res_borrar_carpeta', { nombre: carpeta, transaccion: content })
            fs.writeFile('/home/drew/projects/kernel/log.txt', content, { flag: 'a' }, err => {});
        } catch (e) {
            const content = `Error al borrar carpeta '${carpeta}': ${e}\n`
            socket.emit('res_borrar_carpeta', { nombre: carpeta, error: content })
            fs.writeFile('/home/drew/projects/kernel/log.txt', content, { flag: 'a' }, err => {});
        }    
    } else {
        const content = `Error al borrar carpeta '${carpeta}': Carpeta no existente\n`
        socket.emit('res_borrar_carpeta', { nombre: carpeta, error: content })
        fs.writeFile('/home/drew/projects/kernel/log.txt', content, { flag: 'a' }, err => {});
    }
})

socket.on('crear_archivo', (archivo) => {

    if (fs.existsSync(cwd + archivo)) {
        const content = `Error al crear archivo '${archivo}': archivo ya existente\n`
        socket.emit('res_crear_archivo', {
            nombre: archivo,
            error: content 
        })
        fs.writeFile('/home/drew/projects/kernel/log.txt', content, { flag: 'a' }, err => {});
    } else {
        fs.writeFile(cwd + archivo, '', function (err) {
            if (err) {
                const content = `Error al crear archivo '${archivo}': ${err}\n`
                socket.emit('res_crear_archivo', {
                    nombre: archivo,
                    error: content 
                })
                fs.writeFile('/home/drew/projects/kernel/log.txt', content, { flag: 'a' }, err => {});
                return;
            };
            const content2 = `Archivo ${archivo} creado exitosamente\n`
            socket.emit('res_crear_archivo', {
                nombre: archivo,
                transaccion: content2 
            })
            fs.writeFile('/home/drew/projects/kernel/log.txt', content2, { flag: 'a' }, err => {});
        });
    }
})

socket.on('borrar_archivo', (archivo) => {
    
    if (fs.existsSync(cwd + archivo)) {
        fs.unlink(archivo, function (err) {
            if (err) {
                const content = `Error al borrar archivo '${archivo}: ${err}'\n`
                socket.emit('res_borrar_archivo', { nombre: archivo, error: content })
                fs.writeFile('/home/drew/projects/kernel/log.txt', content, { flag: 'a' }, err => {});
                return;
            }
            const content2 = `Archivo '${archivo}' borrado exitosamente\n`
            socket.emit('res_borrar_archivo', { nombre: archivo, transaccion: content2 })
            fs.writeFile('/home/drew/projects/kernel/log.txt', content2, { flag: 'a' }, err => {});
        })
    } else {
        const content = `Error al borrar archivo '${archivo}': Archivo ya existente\n`
        socket.emit('res_borrar_archivo', { nombre: archivo, error: content })
        fs.writeFile('/home/drew/projects/kernel/log.txt', content, { flag: 'a' }, err => {});
    }
})
