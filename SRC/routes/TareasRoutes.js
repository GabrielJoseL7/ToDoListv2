const express = require('express');
const router = express.Router();

//importar los controladores
const{
    getTareas,
    getTareasById, 
    createTarea,
    updateTarea,
    deleteTarea
} = require('../controllers/tareasControllers');

//Importar los validatores
const{
    validarTareaID,
    validarDatosTarea,
} = require('../middleWare/validators');

//Ruta GET /API/TAREAS
router.get('/',getTareas);

//Ruta GET /API/ttareas:id
router.get('/:id', validarTareaID, getTareasById);

//Ruta POST /Api/tareas
router.post ('/', validarDatosTarea, createTarea);

//Ruta PUT /api/tareas/:id
router.put('/:id', validarTareaID, validarDatosTarea,updateTarea);

//Ruta DELETE /api/tareas/:id
router.delete('/:id', validarTareaID, deleteTarea);

module.exports = router;
