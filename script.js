
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const searchInput = document.getElementById("search");
const notesList = document.getElementById("notesList");
const message = document.getElementById("message");

let notes = JSON.parse(localStorage.getItem("quietnotes") || "[]");
let editingId = null;

// Save notes in browser storage
function saveToStorage() {
    localStorage.setItem("quietnotes", JSON.stringify(notes));
}

// Display notes
function displayNotes(searchText = "") {
    notesList.innerHTML = "";

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchText.toLowerCase()) ||
        note.content.toLowerCase().includes(searchText.toLowerCase())
    );

    if (filteredNotes.length === 0) {
        notesList.textContent = "No notes found. Create your first note!";
        return;
    }

    filteredNotes.forEach(note => {
        const card = document.createElement("div");
        card.className = "note";

        const heading = document.createElement("h3");
        heading.textContent = note.title;

        const paragraph = document.createElement("p");
        paragraph.textContent = note.content;

        const actions = document.createElement("div");
        actions.className = "note-actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => editNote(note.id));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete";
        deleteBtn.addEventListener("click", () => deleteNote(note.id));

        actions.append(editBtn, deleteBtn);
        card.append(heading, paragraph, actions);
        notesList.appendChild(card);
    });
}

// Create or update a note
saveBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        message.textContent = "Please enter both title and content.";
        return;
    }

    if (editingId !== null) {
        const note = notes.find(n => n.id === editingId);
        note.title = title;
        note.content = content;
        message.textContent = "Note updated successfully!";
    } else {
        notes.push({
            id: Date.now(),
            title: title,
            content: content
        });
        message.textContent = "Note saved successfully!";
    }

    saveToStorage();
    resetForm();
    displayNotes(searchInput.value);
});

// Edit a note
function editNote(id) {
    const note = notes.find(n => n.id === id);

    titleInput.value = note.title;
    contentInput.value = note.content;
    editingId = id;

    saveBtn.textContent = "Update Note";
    cancelBtn.hidden = false;
    message.textContent = "Editing your note.";
}

// Delete a note
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);

    if (editingId === id) {
        resetForm();
    }

    saveToStorage();
    displayNotes(searchInput.value);
    message.textContent = "Note deleted.";
}

// Reset editor
function resetForm() {
    titleInput.value = "";
    contentInput.value = "";
    editingId = null;
    saveBtn.textContent = "Save Note";
    cancelBtn.hidden = true;
}

// Cancel editing
cancelBtn.addEventListener("click", () => {
    resetForm();
    message.textContent = "";
});

// Search notes
searchInput.addEventListener("input", () => {
    displayNotes(searchInput.value);
});

// Show saved notes when page opens
displayNotes();
