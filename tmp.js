
const process = require('process');




var exec = require('child_process').exec;




const CP = exec('nvim hello.txt', function(err, stdout, stderr) {
    // console.log(err, stdout, stderr)
    // pid = stdout;
    // console.log(err)
//   setTimeout(() => {
//     // io.emit('crear_proceso', { nombre: 'Gestor Procesos', PID: pid })
//     io.emit('crear_proceso', { nombre: 'Kernel', PID: process.pid })
//   }, 15000)
})

console.log(CP.pid)
