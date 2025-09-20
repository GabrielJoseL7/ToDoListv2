//public/js/app.js
document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const taskForm = document.getElementById('taskForm');
  const editForm = document.getElementById('editForm');
  const tasksList = document.getElementById('tasksList');
  const taskCount = document.getElementById('taskCount');
  const modal = document.getElementById('editModal');
  const closeModal = document.querySelector('.close');
  const filterButtons = document.querySelectorAll('.filter-btn');

  let currentFilter = 'all';

  // Cargar tareas al iniciar
  loadTasks();

  // Event Listeners
  taskForm.addEventListener('submit', handleAddTask);
  editForm.addEventListener('submit', handleEditTask);
  closeModal.addEventListener('click', () => modal.style.display = 'none');

  // Cerrar modal al hacer clic fuera
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Filtros
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Quitar clase active de todos los botones
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Agregar clase active al botón clicked
      this.classList.add('active');

      // Establecer filtro actual
      currentFilter = this.id;

      // Recargar tareas con el filtro aplicado
      loadTasks();
    });
  });

  // Función para cargar tareas
  function loadTasks() {
  let url = 'http://localhost:3000/api/tareas';
  // Aplicar filtro si es necesario
  if (currentFilter === 'pendingTasks') {
    url += '?completada=false';
  } else if (currentFilter === 'completedTasks') {
    url += '?completada=true';
  }
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Aquí accedemos al array de tareas dentro del objeto data
      displayTasks(data.tareas);
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
    });
}

  // Función para mostrar tareas en el DOM
  function displayTasks(tasks) {
    tasksList.innerHTML = '';
    taskCount.textContent = `(${tasks.length})`;

    if (tasks.length === 0) {
      tasksList.innerHTML = '<p class="no-tasks">No hay tareas para mostrar.</p>';
      return;
    }

    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      tasksList.appendChild(taskElement);
    });
  }

  // Función para crear elemento de tarea
  function createTaskElement(task) {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';

    const taskInfo = document.createElement('div');
    taskInfo.className = 'task-info';

    const title = document.createElement('div');
    title.className = `task-title ${task.completada ? 'task-completed' : ''}`;
    title.textContent = task.titulo;

    const status = document.createElement('span');
    status.className = `task-status ${task.completada ? 'status-completed' : 'status-pending'}`;
    status.textContent = task.completada ? 'Completada' : 'Pendiente';
    title.appendChild(status);

    const description = document.createElement('div');
    description.className = 'task-description';
    description.textContent = task.descripcion || 'Sin descripción';

    const dates = document.createElement('div');
    dates.className = 'task-dates';
    dates.textContent = `Creada: ${formatDate(task.fechaCreacion)} | Actualizada: ${formatDate(task.fechaActualizacion)}`;

    taskInfo.appendChild(title);
    taskInfo.appendChild(description);
    taskInfo.appendChild(dates);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.textContent = 'Editar';
    editBtn.addEventListener('click', () => openEditModal(task));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.addEventListener('click', () => deleteTask(task._id)); // Utilizamos _id porque mongoDB no acepta ID numérico

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    taskItem.appendChild(taskInfo);
    taskItem.appendChild(actions);

    return taskItem;
  }

  // Función para formatear fecha
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Manejar agregar tarea
  function handleAddTask(e) {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const completada = document.getElementById('completada').checked;

    const newTask = {
      titulo,
      descripcion,
      completada
    };

    fetch('http://localhost:3000/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw new Error(err.error) });
      }
      return response.json();
    })
    .then(data => {
      loadTasks();
      taskForm.reset();
    })
    .catch(error => {
      console.error('Error:', error);
      alert(`Error al agregar tarea: ${error.message}`);
    });
  }

  // Abrir modal de edición
  function openEditModal(task) {
    document.getElementById('editId').value = task._id; // Utilizamos _id porque mongoDB no acepta ID numérico
    document.getElementById('editTitulo').value = task.titulo;
    document.getElementById('editDescripcion').value = task.descripcion || '';
    document.getElementById('editCompletada').checked = task.completada;

    modal.style.display = 'block';
  }

  // Manejar edición de tarea
  function handleEditTask(e) {
    e.preventDefault();

    const id = document.getElementById('editId').value;
    const titulo = document.getElementById('editTitulo').value.trim();
    const descripcion = document.getElementById('editDescripcion').value.trim();
    const completada = document.getElementById('editCompletada').checked;

    const updatedTask = {
      titulo,
      descripcion,
      completada
    };

    fetch(`http://localhost:3000/api/tareas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw new Error(err.error) });
      }
      return response.json();
    })
    .then(data => {
      alert('Tarea actualizada exitosamente');
      modal.style.display = 'none';
      loadTasks();
    })
    .catch(error => {
      console.error('Error:', error);
      alert(`Error al actualizar la tarea: ${error.message}`);
    });
  }

  // Eliminar tarea
  function deleteTask(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      return;
    }

    fetch(`http://localhost:3000/api/tareas/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw new Error(err.error) });
      }
      return response.json();
    })
    .then(data => {
      alert('Tarea eliminada exitosamente');
      loadTasks();
    })
    .catch(error => {
      console.error('Error:', error);
      alert(`Error al eliminar la tarea: ${error.message}`);
    });
  }
});
