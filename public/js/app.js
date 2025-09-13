document.addEventListener("DOMContentLoaded", function () {
  // Elementos del DOM
  const taskForm = document.getElementById("taskForm");
  const taskList = document.getElementById("tasksList");
  const taskCount = document.getElementById("taskCount");
  const editForm = document.getElementById("editForm");
  const modal = document.getElementById("editModal");
  const closeModal = document.querySelector(".close");
  const filterButtons = document.querySelectorAll(".filter-btn");

  let currentFilter = "all";

  // Cerrar modal al hacer clic fuera
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // Filtros
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      currentFilter = this.id;
      loadTasks();
    });
  });

  // Cargar tareas desde el servidor
  async function loadTasks() {
    try {
      const res = await fetch("http://localhost:3000/api/tareas");
      const data = await res.json();

    const tareas = data.tareas || []

      renderTasks(tareas);
    } catch (error) {
      console.error(error);
      taskList.innerHTML = `<p class="error">Error al cargar las tareas</p>`;
    }
  }

  // Función para mostrar mensaje si no hay tareas
  function renderTasks(tareas) {
    taskList.innerHTML = "";
    taskCount.textContent = tareas.length;

    if (tareas.length === 0) {
      taskList.innerHTML = `<p class="no-task">No hay tareas para mostrar.</p>`;
      return;
    }

    tareas.forEach((t) => {
      if (
        currentFilter === "pendingTasks" && t.completada ||
        currentFilter === "completedTasks" && !t.completada
      ) return;

      const taskEl = document.createElement("div");
      taskEl.className = "task";

      const title = document.createElement("h3");
      title.textContent = t.titulo;

      const desc = document.createElement("p");
      desc.textContent = t.descripcion || "";

      const info = document.createElement("small");
      info.textContent = `Estado: ${t.completada ? "Completada" : "Pendiente"} 
        | Creada: ${new Date(t.fechaCreacion).toLocaleDateString()} 
        | Actualizada: ${new Date(t.fechaActualizacion).toLocaleDateString()}`;

      const actions = document.createElement("div");
      actions.className = "actions";

      const editBtn = document.createElement("button");
      editBtn.textContent = "Editar";
      editBtn.onclick = () => openEditModal(t);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Eliminar";
      deleteBtn.onclick = () => deleteTask(t.id);

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      taskEl.appendChild(title);
      taskEl.appendChild(desc);
      taskEl.appendChild(info);
      taskEl.appendChild(actions);

      taskList.appendChild(taskEl);
    });
  }

  // Función para insertar tarea
  async function addTask(titulo, descripcion, completada) {
    const data = { titulo, descripcion, completada, fecha: new Date().toISOString() };
    try {
      const res = await fetch("http://localhost:3000/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al crear tarea");
      loadTasks();
    } catch (error) {
      console.error(error);
      alert("No se pudo crear la tarea");
    }
  }

  // Manejar envío de nueva tarea
  taskForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const completada = document.getElementById("completada").checked;

    if (!titulo) {
      alert("El título es obligatorio");
      return;
    }

    await addTask(titulo, descripcion, completada);
    taskForm.reset();
  });

  // Abrir modal para edición
  function openEditModal(task) {
    document.getElementById("editId").value = task.id;
    document.getElementById("editTitulo").value = task.titulo;
    document.getElementById("editDescripcion").value = task.descripcion || "";
    document.getElementById("editCompletada").checked = task.completada;
    modal.style.display = "block";
  }

  // Guardar cambios de tarea editada
  editForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const id = document.getElementById("editId").value;
    const titulo = document.getElementById("editTitulo").value.trim();
    const descripcion = document.getElementById("editDescripcion").value.trim();
    const completada = document.getElementById("editCompletada").checked;

    const data = { titulo, descripcion, completada };

    try {
      const res = await fetch(`http://localhost:3000/api/tareas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al actualizar tarea");
      modal.style.display = "none";
      loadTasks();
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar la tarea");
    }
  });

  // Eliminar tarea
  async function deleteTask(id) {
    if (!confirm("¿Estás seguro de que quieres eliminar esta tarea?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/tareas/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar tarea");
      loadTasks();
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar la tarea");
    }
  }

  // Cargar tareas al inicio
  loadTasks();
});
