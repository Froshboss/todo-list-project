// DOM element references for the todo app
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");
const sortSelect = document.getElementById("sortSelect");

// Load the saved sort preference from localStorage
function loadSort() {
    const savedSort = localStorage.getItem("sortValue") || "default";
    sortSelect.value = savedSort;
}

// Initialize sort preference on page load
loadSort();

// Function to add a new task to the list
function addTask() {
    
    // Get and validate the task text
    const task = inputBox.value.trim();
    if (!task) {
        alert("Please write down a task");
        return;
    }

    // Create the list item element with HTML structure
    const li = document.createElement("li");
    li.innerHTML = `
        <label>
            <input type="checkbox">
            <span>${task}</span>
        </label>
        <span class="edit-btn">Edit</span>
        <span class="delete-btn">Delete</span>
    `;

    // Add the task to the DOM
    listContainer.appendChild(li);
    inputBox.value = "";

    // Get references to the newly created elements
    const checkbox = li.querySelector("input");
    const editBtn = li.querySelector(".edit-btn");
    const taskSpan = li.querySelector("span");
    const deleteBtn = li.querySelector(".delete-btn");

    // Event listener for editing a task
    editBtn.addEventListener("click", function () {
        const update = prompt("Edit task:", taskSpan.textContent);
        if (update !== null) {
            taskSpan.textContent = update;
            li.classList.remove("completed");
            checkbox.checked = false;
            updateCounters();
            saveData();
            if (sortSelect.value !== "default") {
                sortTasks();
            }
        }
    });

    // Event listener for toggling task completion
    checkbox.addEventListener("change", function () {
        li.classList.toggle("completed", checkbox.checked);
        updateCounters();
        saveData();
        if (sortSelect.value !== "default") {
            sortTasks();
        }
    });

    // Event listener for deleting a task
    deleteBtn.addEventListener("click", function () {
        li.remove();
        updateCounters();
        saveData();
    });

    // Update counters and save data after adding
    updateCounters();
    saveData();
    if (sortSelect.value !== "default") {
        sortTasks();
    }
}

// Update the completed and uncompleted task counters
function updateCounters() {
    const completedTasks = document.querySelectorAll(".completed").length;
    const uncompletedTasks = document.querySelectorAll("li:not(.completed)").length;

    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = uncompletedTasks;
}

// Save the current tasks to localStorage for persistence
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

// Sort the tasks based on the selected sorting option
function sortTasks() {
    const sortValue = sortSelect.value;
    const listItems = Array.from(listContainer.querySelectorAll("li"));

    // Skip sorting if default is selected
    if (sortValue === "default") {
        return;
    }

    // Sort the list items based on the selected criteria
    listItems.sort((a, b) => {
        const textA = a.querySelector("span").textContent.toLowerCase();
        const textB = b.querySelector("span").textContent.toLowerCase();
        const completedA = a.querySelector("input").checked;
        const completedB = b.querySelector("input").checked;

        if (sortValue === "a-z") {
            // Alphabetical sorting
            return textA.localeCompare(textB);
        } else if (sortValue === "status") {

            // Sort by completion status (incomplete first)
            if (completedA === completedB) {
                return textA.localeCompare(textB); // If same status, sort by text
            }
            return completedA ? 1 : -1; // Incomplete tasks come first
        }
    });

    // Re-append the sorted items to the DOM
    listItems.forEach(li => listContainer.appendChild(li));

    // Save the current sort preference
    localStorage.setItem("sortValue", sortValue);
}

// Load saved tasks from localStorage and recreate them in the DOM
function loadData() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {

        // Create the list item element
        const li = document.createElement("li");
        li.innerHTML = `
            <label>
                <input type="checkbox" ${task.completed ? "checked" : ""}>
                <span>${task.text}</span>
            </label>
            <span class="edit-btn">Edit</span>
            <span class="delete-btn">Delete</span>
        `;

        // Apply completed class if the task was completed
        if (task.completed) {
            li.classList.add("completed");
        }

        // Add the task to the DOM
        listContainer.appendChild(li);

        // Get references to the elements for event listeners
        const checkbox = li.querySelector("input");
        const editBtn = li.querySelector(".edit-btn");
        const taskSpan = li.querySelector("span");
        const deleteBtn = li.querySelector(".delete-btn");

        // Event listener for editing loaded tasks
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

        // Event listener for toggling completion of loaded tasks
        checkbox.addEventListener("change", function () {
            li.classList.toggle("completed", checkbox.checked);
            updateCounters();
            saveData();
        });

        // Event listener for deleting loaded tasks
        deleteBtn.addEventListener("click", function () {
            li.remove();
            updateCounters();
            saveData();
        });
    });
    // Update counters after loading all tasks
    updateCounters();
    // Apply sorting if a sort option is selected
    if (sortSelect.value !== "default") {
        sortTasks();
    }
}

// Load saved tasks on page initialization
loadData();

// Event listener for the sort select dropdown
sortSelect.addEventListener("change", sortTasks);