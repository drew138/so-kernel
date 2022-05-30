
import React from 'react'


const App= ({ socket })=> {
  const [disconnected, setDisconnected] = React.useState(false)
  const [transacciones, setTransacciones] = React.useState([])
  const [archivos, setArchivos] = React.useState([]);
  const [carpetas, setCarpetas] = React.useState([]);
  const [procesos, setProcesos] = React.useState([]);

  const creadorArchivos = React.useRef()
  const creadorCarpetas = React.useRef()

  // React.useEffect(()=>{
    socket.on('res_borrar_archivo', (res) => {
      if ('error' in res) {
        setTransacciones(transacciones => transacciones.concat(res.error))
      } else {
        setArchivos([...archivos.filter(archivo => archivo !== res.nombre)])
        setTransacciones((transacciones) => transacciones.concat(res.transaccion))
      }

    })
    socket.on('res_crear_archivo', (res) => {

      if ('error' in res) {
        console.log(transacciones)
        setTransacciones(transacciones => transacciones.concat(res.error))
      } else {
        setArchivos([...archivos, res.nombre])
        setTransacciones(transacciones => transacciones.concat(res.transaccion))
      }
    })
    socket.on('res_crear_carpeta', (res) => {

      if ('error' in res) {
        setTransacciones(transacciones => transacciones.concat(res.error))
      } else {

        setCarpetas([...carpetas, res.nombre])
        setTransacciones(transacciones => transacciones.concat(res.transaccion))
      }
    })
    socket.on('res_borrar_carpeta', (res) => {
      if ('error' in res) {
        setTransacciones(transacciones => transacciones.concat(res.error))
      } else {

        setCarpetas([...carpetas.filter(carpeta => carpeta !== res.nombre)])
        setTransacciones(transacciones => transacciones.concat(res.transaccion))
      }
    })

    socket.on('res_borrar_proceso', (res) => {

      if ('error' in res) {
        setTransacciones(transacciones => transacciones.concat(res.error))
      } else {
        const tmp = [...procesos.map( proceso => ({... proceso}))]
        setProcesos([...tmp.filter(proceso => proceso.PID !== res.PID)])
        setTransacciones(transacciones =>  transacciones.concat(res.transaccion))
      }
    })

    socket.on('crear_proceso', (data) => {
      setProcesos(procesos => procesos.concat(data));
    })

    // socket.on('connect_error', ()=>{
    //   setTimeout(()=>socket.connect(), 5000)
    // })
  //  socket.on('time', (data)=>setTime(data))
   socket.on('disconnect',()=>{
    setDisconnected(true)
  })
 
    // setInterval(()=>{
    //     socket.emit("time", new Date())
    // }, 1000)
    //  io.to("clock-room").emit("time", new Date())
//  },[])

 const borrarProceso = (PID) => {
  socket.emit('borrar_proceso', PID)
 }

 const crearCarpeta = (nombre) => {
  socket.emit('crear_carpeta', nombre)
 }

 const borrarCarpeta = (nombre) => {
   socket.emit('borrar_carpeta', nombre)
 }
 
 const crearArchivo = (nombre) => {
  socket.emit('crear_archivo', nombre)
 }


 const borrarArchivo = (nombre) => {
   socket.emit('borrar_archivo', nombre)
 }
 
 if (disconnected) return (
   <h1>Error</h1>
 )

 return (
   <div className="App">


    <h1>Procesos</h1>
      <input type="text"></input>
      <table>
        <tbody>

        <tr>
          <th>Proceso</th>
          <th>PID</th>
          <th>Acciones</th>
        </tr>
        {procesos.map(proceso => {
          return (
            <tr>
              <td>{proceso.nombre}</td>
              <td>{proceso.PID}</td>
              <td><button onClick={() => borrarProceso(proceso.PID)}>Borrar</button></td>
            </tr>
          )
        })}
        </tbody>
      </table>
    <h1>Archivos</h1>
      <input type="text" ref={creadorArchivos}></input>
      <button onClick={() => crearArchivo(creadorArchivos.current.value)}>Crear Archivo</button>
      <input type="text" ref={creadorCarpetas}></input>
      <button onClick={() => crearCarpeta(creadorCarpetas.current.value)}>Crear Carpeta</button>
      
      <table>
        <tbody>

        <tr>
          <th>Carpeta</th>
          <th>Acciones</th>
        </tr>
        {carpetas.map(carpeta => {
          return (
            <tr>
              <td>{carpeta}</td>
              <td><button onClick={() => borrarCarpeta(carpeta)}>Borrar</button></td>
            </tr>
          )
        })}
        </tbody>
      </table>

      <table>
        <tbody>

        <tr>
          <th>Archivo</th>
          <th>Acciones</th>
        </tr>
        {archivos.map(archivo => {
          return (
            <tr>
              <td>{archivo}</td>
              <td><button onClick={() => borrarArchivo(archivo)}>Borrar</button></td>
            </tr>
          )
        })}
        </tbody>
      </table>

    <h1>Transacciones</h1>
    <ul>
      {
        transacciones
          .map(transaccion => <li >{transaccion}</li>)
      }
    </ul>
   </div>
 )
}
export default App;