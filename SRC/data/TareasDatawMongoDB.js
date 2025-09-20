let tareas = [
    {
        id: 1,
        titulo: 'Aprender HTML',
        descripcion: "Estudiar los fundamentos de HTML",
        completada: false,
        fechaCreacion: new Date('2025-09-02'), //formato fecha YYYY-MMM-DD
        fechaActualizacion: new Date ('2025-09-02')
    },
    {
        id: 2,
        titulo: 'Aprender CSS',
        descripcion: "Estudiar los fundamentos de CSS",
        completada: false,
        fechaCreacion: new Date('2025-09-02'), //formato fecha YYYY-MMM-DD
        fechaActualizacion: new Date ('2025-09-02')
    },
    {
        id: 3,
        titulo: 'Aprender JavSsript',
        descripcion: "Estudiar los fundamentos de JavaScript",
        completada: false,
        fechaCreacion: new Date('2025-09-02'), //formato fecha YYYY-MMM-DD
        fechaActualizacion: new Date ('2025-09-02')
    },    
]

let nextId = 4;

//Funcion para obtener todas las tareas
const obtenerTodasLasTareas = () => tareas;

//funcion para obtener tareas por ID
const obtenerTareasPorId = (id) => tareas.find(t => t.id === id);

//funcion para crear nueva tareas
const crearTarea = (tareaData) => {
    const nuevaTarea = {
        id: nextId++,
        ...tareaData, //Operador Spread se utiliza para copiar datos
        fechaCreacion: new Date(), 
        fechaActualizacion: new Date(),
    };

    tareas.push(nuevaTarea); 
    return nuevaTarea;
};

//Funcion para actualizar tarea
const actualizarTarea = (id, nuevosDatos) => {
    const index = tareas.findIndex(t => t.id === id);
    if (index === -1 ) return null;

    tareas[index] = {
        ...tareas[index],
        ...nuevosDatos,
        fechaActualizacion: new Date()
    };

    return tareas[index];
};

// Funcion para eliminar tarea
const eliminarTarea= (id) => {
    const index = tareas.findIndex(t => t.id === id);
    if (index === -1) return null;

    return tareas.splice(index, 1)[0];
}; 

//Exportar todas las funciones para utilizar en otros archivos
module.exports = {
    obtenerTodasLasTareas,
    obtenerTareasPorId,
    crearTarea,
    actualizarTarea,
    eliminarTarea
};
