const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

function addTask() {
    const task = inputBox.value.trim();
    if (!task) {
        alert("Please write down a task");
        return;
    }

    const li = document.createElement("li");
    li.innerHTML = `
        <label>
            <input type="checkbox">
            <span>${task}</span>
        </label>
        <span class="edit-btn">Edit</span>
        <span class="delete-btn">Delete</span>
    `;

    listContainer.appendChild(li);
    inputBox.value = "";

    // Query elements after appending
    const checkbox = li.querySelector("input");
    const editBtn = li.querySelector(".edit-btn");
    const taskSpan = li.querySelector("span");
    const deleteBtn = li.querySelector(".delete-btn");

    // Attach event listeners
    editBtn.addEventListener("click", function () {
        const update = prompt("Edit task:", taskSpan.textContent);
        if (update !== null) {
            taskSpan.textContent = update;
            li.classList.remove("completed");
        }
    });

    checkbox.addEventListener("change", function () {  // Use 'change' for better checkbox handling
        li.classList.toggle("completed", checkbox.checked);
        updateCounters();
    });

    deleteBtn.addEventListener("click", function () {
        li.remove();
        updateCounters();
    });

    // Update counters after adding
    updateCounters();
    saveData();
}

function updateCounters() {
    const completedTasks = document.querySelectorAll(".completed").length;
    const uncompletedTasks = document.querySelectorAll("li:not(.completed)").length;
    
    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = uncompletedTasks;
}

function saveData() {
    const tasks = [];
    const listItems = listContainer.querySelectorAll("li");
    listItems.forEach(li => {
        const taskSpan = li.querySelector("span");
        const checkbox = li.querySelector("input");
        tasks.push({
            text: taskSpan.textContent,
            completed: checkbox.checked
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadData() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
            <label>
                <input type="checkbox" ${task.completed ? "checked" : ""}>
                <span>${task.text}</span>
            </label>
            <span class="edit-btn">Edit</span>
            <span class="delete-btn">Delete</span>
        `;

        if (task.completed) {
            li.classList.add("completed");
        }

        listContainer.appendChild(li);

        // Query elements after appending
        const checkbox = li.querySelector("input");
        const editBtn = li.querySelector(".edit-btn");
        const taskSpan = li.querySelector("span");
        const deleteBtn = li.querySelector(".delete-btn");

        // Attach event listeners
        editBtn.addEventListener("click", function () {
            const update = prompt("Edit task:", taskSpan.textContent);
            if (update !== null) {
                taskSpan.textContent = update;
                li.classList.remove("completed");
                checkbox.checked = false;
                updateCounters();
                saveData();
            }
        });

        checkbox.addEventListener("change", function () {  // Use 'change' for better checkbox handling
            li.classList.toggle("completed", checkbox.checked);
            updateCounters();
            saveData();
        });

        deleteBtn.addEventListener("click", function () {
            li.remove();
            updateCounters();
            saveData();
        });
    });
    updateCounters();
}

// Load data on page load
loadData();
