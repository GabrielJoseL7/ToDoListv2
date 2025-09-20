const mongo = require('mongoose');

//Definir el esquema de tareas
const tareasSchema = new mongo.Schema({
    /* id:{type: Number, required: true}, */
    titulo:{type: String, required: true},
    descripcion:{type: String, required: false},
    completada:{type: Boolean, default: false},
    fechaCreacion:{type:Date, default: Date.now},
    fechaActualizacion:{type: Date, default: Date.now}
});

//Crear el modelo
const Tareas = mongo.model('Tareas', tareasSchema);

//Conexion a MongoDB
const conectarDB = async () => {
    try{
       const MONGODB_URI = process.env.MONGODB_CONEXION;
       await mongo.connect(MONGODB_URI, {
        dbName: process.env.DB_NAME
       });
       

        console.log('Conectado a MongoDB Atlas');
    }
    catch(error){
        console.error('Error conectando a MongoDB: ', error.message);
    }
};

//Funcion para obtener todas las tareas
const obtenerTodasLasTareas = async () => {
    try{
        return await Tareas.find().sort({fechaCreacion:-1});
    }
    catch(error){
        console.error('Error obteniendo las tareas: ', error.message)
    }
}

//Funcion para obtener las tareas por ID
const obtenerTareasPorID = async () => {
    try{
        return await Tareas.findById(id);
    }
    catch(error){
        console.error('Error obteniendo las tareas por ID: ', error.message)
    }
}

//Funcion para crear nueva tarea
const crearTarea = async (tareaData) => {
    try{
        const nuevaTarea = new Tareas(tareaData);
        return await nuevaTarea.save();
    }
    catch(error){
        console.error('Error creando tarea: ', error.message)
    }
};

const actualizarTarea = async (id, nuevosDatos) => {
    try{
        return await Tareas.findByIdAndUpdate(
            id, 
            {
                ...nuevosDatos, fechaActualizacion: new Date()
            }
        );
    }
    catch(error){
        console.error('Error actualizando la tarea: ', error.message)
    }
}

const eliminarTarea = async(id) => {
    try{
        return await Tareas.findByIdAndDelete(id);
    }
    catch(error){
        console.error('Error eliminando tareas: ', error.message)
    }
}

//Exportar el modulo
module.exports = {
    conectarDB,
    Tareas, 
    obtenerTodasLasTareas,
    obtenerTareasPorID, 
    crearTarea,
    actualizarTarea, 
    eliminarTarea
};