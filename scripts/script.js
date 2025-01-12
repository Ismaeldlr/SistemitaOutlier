// ------------------------------------------------------------
//                          Tasks Tab
// ------------------------------------------------------------

async function fetchTasks() {
    try {
        const response = await fetch('http://localhost:3000/tasks');
        const tasks = await response.json();

        const taskList = document.getElementById('tasks');
        const taskCounter = document.getElementById('task-counter'); // Get the counter element

        taskList.innerHTML = ''; // Clear existing tasks

        // Update the task counter
        taskCounter.textContent = `Tasks stored: ${tasks.length}`;

        tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task');

            // Assuming task is an object with these properties
            const { permalink, id1, id2, justification } = task;

            taskDiv.innerHTML = `
                <p><strong>Permalink:</strong> <a href="${permalink}" target="_blank">${permalink}</a></p>
                <p><strong>ID1:</strong> ${id1}</p>
                <p><strong>ID2:</strong> ${id2}</p>
                <p><strong>Justification:</strong> ${justification}</p>
                <div class="task-buttons">
                    <button class="copy-btn">Copy</button>
                    <button class="delete-btn">Delete</button>
                </div>
                <div class="task-buttons">
                    <button class="permalink-btn">Permalink</button>
                    <button class="id1-btn">ID1</button>
                    <button class="id2-btn">ID2</button>
                    <button class="justification-btn">Justification</button>
                </div>
            `;

            // Add event listener for the "Copy" button
            const copyButton = taskDiv.querySelector('.copy-btn');
            copyButton.addEventListener('click', () => {
                copyToClipboard(permalink, id1, id2, justification);
            });

            //Copy permalink
            const copyPermalink = taskDiv.querySelector('.permalink-btn');
            copyPermalink.addEventListener('click', () => {
                navigator.clipboard.writeText(permalink).then(() => {
                    alert("Permalink copiado al portapapeles.");
                }).catch((err) => {
                    console.error("Error al copiar al portapapeles: ", err);
                });
            });

            //Copy ID1
            const copyId1 = taskDiv.querySelector('.id1-btn');
            copyId1.addEventListener('click', () => {
                navigator.clipboard.writeText(id1).then(() => {
                    alert("ID1 copiado al portapapeles.");
                }).catch((err) => {
                    console.error("Error al copiar al portapapeles: ", err);
                });
            });

            //Copy ID2
            const copyId2 = taskDiv.querySelector('.id2-btn');
            copyId2.addEventListener('click', () => {
                navigator.clipboard.writeText(id2).then(() => {
                    alert("ID2 copiado al portapapeles.");
                }).catch((err) => {
                    console.error("Error al copiar al portapapeles: ", err);
                });
            });

            //Copy Justification
            const copyJustification = taskDiv.querySelector('.justification-btn');
            copyJustification.addEventListener('click', () => {
                navigator.clipboard.writeText(justification).then(() => {
                    alert("Justificación copiada al portapapeles.");
                }).catch((err) => {
                    console.error("Error al copiar al portapapeles: ", err);
                });
            });

            // Add event listener for the "Delete" button
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
            fetchTasks(); // Refresh tasks
        } else {
            alert('Failed to add task.');
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

async function deleteTask(permalink) {
    try {
        const response = await fetch('http://localhost:3000/tasks', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ permalink }),
        });

        if (response.ok) {
            alert('Task deleted successfully!');
            fetchTasks(); // Refresh tasks
        } else {
            alert('Failed to delete task.');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

function copyToClipboard(link, num1, num2, justification) {
    const values = [link, num1, num2, justification];
    let copiedCount = 0;

    values.forEach((value, index) => {
        setTimeout(() => {
            navigator.clipboard.writeText(value).then(() => {
                copiedCount++;
                if (copiedCount === values.length) {
                    alert("Datos copiados al portapapeles como elementos separados.");
                }
            }).catch((err) => {
                console.error("Error al copiar al portapapeles: ", err);
            });
        }, index * 500);
    });
}

const toggleNormal = document.getElementById('toggle-normal');
const toggleReject = document.getElementById('toggle-reject');
const normalFields = document.getElementById('normal-fields');
const form = document.getElementById('task-form');
let isRejectMode = false;

// Toggle between Normal and Reject modes
toggleNormal.addEventListener('click', () => {
    isRejectMode = false;
    toggleNormal.classList.add('active');
    toggleReject.classList.remove('active');
    normalFields.style.display = 'block'; // Show ID1 and ID2 fields
    document.getElementById('id1').disabled = false;
    document.getElementById('id2').disabled = false;
});

toggleReject.addEventListener('click', () => {
    isRejectMode = true;
    toggleReject.classList.add('active');
    toggleNormal.classList.remove('active');
    normalFields.style.display = 'none'; // Hide ID1 and ID2 fields
    document.getElementById('id1').disabled = true;
    document.getElementById('id2').disabled = true;
});

document.addEventListener('DOMContentLoaded', () => {
    // Run only on the Tasks page
    if (document.body.contains(document.getElementById('task-form'))) {
        fetchTasks();

        const form = document.getElementById('task-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const permalink = document.getElementById('permalink').value;
            const justification = document.getElementById('justification').value;

            if (isRejectMode) {
                // Reject mode: Exclude ID1 and ID2
                addTask(permalink, 'Not Applicable', 'Not Applicable', justification);
            } else {
                const id1 = document.getElementById('id1').value;
                const id2 = document.getElementById('id2').value;

                if (id1 && id2) {
                    addTask(permalink, id1, id2, justification);
                } else {
                    alert('Please fill in all fields!');
                }
            }
        });
    }
});
