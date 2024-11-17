// Función para eliminar una tarea del archivo
async function deleteTask(permalink) {
    try {
        const response = await fetch(`http://localhost:3000/tasks`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ permalink }),
        });

        if (response.ok) {
            alert('Task deleted successfully!');
            fetchTasks(); // Refresca la lista de tareas
        } else {
            alert('Failed to delete task.');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Función para obtener y mostrar las tareas desde el backend
async function fetchTasks() {
    try {
        const response = await fetch('http://localhost:3000/tasks');
        const tasks = await response.json();

        const taskList = document.getElementById('tasks');
        const taskCounter = document.getElementById('task-counter');
        taskList.innerHTML = ''; // Limpia las tareas existentes

        // Actualiza el contador de tareas
        taskCounter.textContent = `Tasks stored: ${tasks.length}`;

        tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task');

            // Divide cada tarea en líneas para estructurarla
            const lines = task.split('\n').filter(line => line.trim() !== '');
            const permalink = lines[0];
            const id1 = lines[1];
            const id2 = lines[2];
            const justification = lines.slice(3).join(' '); // Combina el resto como justificación

            // Crea el HTML estructurado para cada tarea con botones de copiar y eliminar
            taskDiv.innerHTML = `
                <p><strong>Permalink:</strong> <a href="${permalink}" target="_blank">${permalink}</a></p>
                <p><strong>ID1:</strong> ${id1}</p>
                <p><strong>ID2:</strong> ${id2}</p>
                <p><strong>Justification:</strong> ${justification}</p>
                <div class="task-buttons">
                    <button class="copy-btn">Copy</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            // Agrega funcionalidad de copiar al botón
            const copyButton = taskDiv.querySelector('.copy-btn');
            copyButton.addEventListener('click', () => {
                copyToClipboard(permalink, id1, id2, justification);
            });

            // Agrega funcionalidad de eliminar al botón
            const deleteButton = taskDiv.querySelector('.delete-btn');
            deleteButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this task?')) {
                    deleteTask(permalink);
                }
            });

            taskList.appendChild(taskDiv);
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}


// Función para copiar los datos al portapapeles como elementos separados
function copyToClipboard(link, num1, num2, justificacion) {
    const values = [link, num1, num2, justificacion];
    values.forEach((value, index) => {
        setTimeout(() => {
            navigator.clipboard.writeText(value).then(() => {
                if (index === values.length - 1) {
                    alert("Datos copiados al portapapeles como elementos separados.");
                }
            }).catch((err) => {
                console.error("Error al copiar al portapapeles: ", err);
            });
        }, index * 500);
    });
}

// Función para agregar una nueva tarea
async function addTask(permalink, id1, id2, justification) {
    try {
        const response = await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ permalink, id1, id2, justification }),
        });

        if (response.ok) {
            alert('Task added successfully!');
            document.getElementById('task-form').reset();
            fetchTasks(); // Refresca la lista de tareas
        } else {
            alert('Failed to add task.');
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

// Maneja la submit del formulario para agregar una nueva tarea
document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const permalink = document.getElementById('permalink').value;
    const id1 = document.getElementById('id1').value;
    const id2 = document.getElementById('id2').value;
    const justification = document.getElementById('justification').value;

    if (permalink && id1 && id2 && justification) {
        addTask(permalink, id1, id2, justification);
    } else {
        alert('Please fill in all fields!');
    }
});

// Carga las tareas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
});
