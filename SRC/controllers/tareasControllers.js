const{
    obtenerTodasLasTareas,
    obtenerTareasPorID, 
    crearTarea, 
    actualizarTarea, 
    eliminarTarea, 
} = require('../data/tareasData');

//Controlador para obtener todas las tareas

const getTareas = async (req, res) => {
    try {
        const {completada} = req.query;
        let tareas = await obtenerTodasLasTareas();

        if(completada !== undefined){
            const estaCompletada = completada === 'true';
            tareas = tareas.filter(tarea => tarea.completada === estaCompletada);
        }

        res.json({
            count: tareas.length,
            tareas
        });
    }

    catch(error){
        res.status(500).json({error: "Error al obtener todas las tareas"});
    }
};

//Controlador para obtener tarea por ID
const getTareasById = async (req, res) => {
    try{
        const tarea = await obtenerTareasPorID(req.params.id);

        //sino encuentra la tarea 
        if(!tarea){
            return res.status(400).json({error: 'Tarea no encontrada'});
        }

        //Mos devuelve la tarea encontrada
        res.json(tarea);
    }

    catch(error){
        res.status(500).json({error: "Error al obtener la tarea"});
    }
};

//Controlador para crear nueva tarea
const createTarea = async (req, res) => {
    try{
        const {titulo, descripcion, completada} = req.body;

        const nuevaTarea = await crearTarea({
            titulo: titulo.trim(),
            descripcion: descripcion ? descripcion.trim():'',
            completada: completada || false
        });

        res.status(201).json({
            message: 'Tarea creada exitosamewnte',
            tarea: nuevaTarea
        })
    }

    catch (error){
        res.status(500).json({error: 'Error al crear la tarea'});
    }
};

//Actualizar tarea completa (PUT)
const updateTarea = async (req, res) => {
    try {
        const { titulo, descripcion, completada } = req.body;

        const tareaActualizada = await actualizarTarea(req.id, {
            titulo: titulo.trim(),
            descripcion: descripcion ? descripcion.trim(): '',
            completada: completada !== undefined ? completada : false
        });

        if (!tareaActualizada) {
            return res.status(404).json({ error: 'Tarea no encontrada'});
        };

        res.json({
            message: 'Tarea actulizada exitosamente',
            tarea: tareaActualizada
        })

    }
    catch (error){
        res.status(500).json({ error: 'Error al actualizar la tarea'});
    }
};

// Eliminar Tarea 
const deleteTarea = async (req, res) => {
    try{
        const tareaEliminada = await eliminarTarea(req.id);

        if(!tareaEliminada) {
            return res.status(404).json({error: 'Tarea no encontrada'});
        }

        res.json({
            message: 'Tarea eliminada exitosamente',
            tarea: tareaEliminada
        });
    }
    catch (error){
        res.status(500).json({
            error: 'Error al eliminar la tarea'
        });
    }
};

module.exports = {
    getTareas,
    getTareasById,
    createTarea,
    updateTarea,
    deleteTarea
};