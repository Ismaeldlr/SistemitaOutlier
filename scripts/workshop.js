document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('popup');
    const setInstructionsBtn = document.getElementById('set-instructions-btn');
    const closeBtn = document.querySelector('.close-btn');
    const saveInstructionsBtn = document.getElementById('save-instructions-btn');
    const instructionsParagraph = document.getElementById('instructions-paragraph');
    const instructionsTextarea = document.getElementById('instructions-textarea');
    const createPromptBtn = document.getElementById('create-prompt-btn');
    const promptDisplay = document.getElementById('prompt-display');
    const copyPromptBtn = document.getElementById('copy-prompt-btn');
    const deletePromptBtn = document.getElementById('delete-prompt-btn');
    const addPromptBtn = document.getElementById('add-prompt-btn');

    // Show the popup when the "Set Instructions" button is clicked
    setInstructionsBtn.addEventListener('click', () => {
        popup.style.display = 'block';
    });

    // Close the popup when the close button is clicked
    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // Close the popup when clicking outside of the popup content
    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });

    // Save instructions and update the paragraph
    saveInstructionsBtn.addEventListener('click', () => {
        const instructions = instructionsTextarea.value;
        instructionsParagraph.textContent = instructions;
        popup.style.display = 'none';
    });

    // Create prompt when the "Create Prompt" button is clicked
    createPromptBtn.addEventListener('click', () => {
        const instructions = instructionsParagraph.textContent;
        const prompt = document.getElementById('response0').value;
        const id1 = document.getElementById('id1').value;
        const id2 = document.getElementById('id2').value;
        const response1 = document.getElementById('response1').value;
        const response2 = document.getElementById('response2').value;

        const promptText = `
I need your help judging between two responses and providing me with a justification.

Here are the instructions:

${instructions}

----------------------------
User's prompt:

${prompt}


----------------------------
Response ${id1}:

${response1}

----------------------------
Response ${id2}:

${response2}
----------------------------
        `;

        promptDisplay.innerHTML = `<p>${promptText.replace(/\n/g, '<br>')}</p>`;
    });

    // Copy prompt to clipboard when the "Copy" button is clicked
    copyPromptBtn.addEventListener('click', () => {
        const promptText = promptDisplay.innerText;
        navigator.clipboard.writeText(promptText).then(() => {
            alert('Prompt copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });

    // Delete prompt when the "Delete" button is clicked
    deletePromptBtn.addEventListener('click', () => {
        promptDisplay.innerHTML = '<p>Prompt will be displayed here...</p>';
    });

    // Add task when the "Add" button is clicked
    addPromptBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        const permalink = document.getElementById('permalink').value;
        const id1 = document.getElementById('id1').value;
        const id2 = document.getElementById('id2').value;
        const justification = document.getElementById('justification').value;

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
                document.getElementById('response0').value = '';
                document.getElementById('response1').value = '';
                document.getElementById('response2').value = '';
            } else {
                alert('Failed to add task.');
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    });
});