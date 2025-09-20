const mongoose = require('mongoose');


//Middleware para validar ObjectId de mongoDB
const validarTareaID = (req, res, next) => {
    const { id } = req.params; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            error: 'ID debe ser un ObjectId valido de mongoDB. Ejemplo 507f1f77bvf86cd799439011'
        });
    }

    req.id = id;
    next();
};

//Middleware para validar datos de la tarea
const validarDatosTarea = (req, res, next) => {
    const {titulo} = req.body;

    if (req.method === "POST" || req.method === "PUT") {
        if (!titulo || titulo.trim() === ''){
            return res.status(400).json({error: "El titulo es obligatorio"});
        }

        //Limpiar Datos
        if (titulo) req.body.titulo = titulo.trim();
        if (req.body.descripcion) {
            req.body.descripcion = req.body.descripcion.trim();
        }
    }

    next();
}

module.exports = {
    validarTareaID,
    validarDatosTarea
}