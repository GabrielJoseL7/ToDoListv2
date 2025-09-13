const validarTareaID = (req, res, next) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        return res.status(400).json({error: 'ID debe ser un numero valido'});
    }
    req.id = id;
    next();
};

const validarDatosTarea = (req, res, next) => {
    const { titulo, descripcion, completada } = req.body;

    if (req.method === "POST" || req.method === "PUT") {
        if (!titulo || titulo.trim() === '') {
            return res.status(400).json({error: "El titulo es obligatorio"});
        };
    };

    next();
}

module.exports = {
    validarTareaID,
    validarDatosTarea,
}