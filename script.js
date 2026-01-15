const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");
const sortSelect = document.getElementById("sortSelect");

function loadSort() {
    const savedSort = localStorage.getItem("sortValue") || "default";
    sortSelect.value = savedSort;
}

loadSort();

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

    const checkbox = li.querySelector("input");
    const editBtn = li.querySelector(".edit-btn");
    const taskSpan = li.querySelector("span");
    const deleteBtn = li.querySelector(".delete-btn");

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

    checkbox.addEventListener("change", function () {
        li.classList.toggle("completed", checkbox.checked);
        updateCounters();
        saveData();
        if (sortSelect.value !== "default") {
            sortTasks();
        }
    });

    deleteBtn.addEventListener("click", function () {
        li.remove();
        updateCounters();
        saveData();
    });

    updateCounters();
    saveData();
    if (sortSelect.value !== "default") {
        sortTasks();
    }
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

function sortTasks() {
    const sortValue = sortSelect.value;
    const listItems = Array.from(listContainer.querySelectorAll("li"));

    if (sortValue === "default") {
        return;
    }

    listItems.sort((a, b) => {
        const textA = a.querySelector("span").textContent.toLowerCase();
        const textB = b.querySelector("span").textContent.toLowerCase();
        const completedA = a.querySelector("input").checked;
        const completedB = b.querySelector("input").checked;

        if (sortValue === "a-z") {
            return textA.localeCompare(textB);
        } else if (sortValue === "status") {

            if (completedA === completedB) {
                return textA.localeCompare(textB);
            }
            return completedA ? 1 : -1;
        }
    });

    listItems.forEach(li => listContainer.appendChild(li));

    localStorage.setItem("sortValue", sortValue);
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

        const checkbox = li.querySelector("input");
        const editBtn = li.querySelector(".edit-btn");
        const taskSpan = li.querySelector("span");
        const deleteBtn = li.querySelector(".delete-btn");

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

        checkbox.addEventListener("change", function () {
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
    if (sortSelect.value !== "default") {
        sortTasks();
    }
}

loadData();

sortSelect.addEventListener("change", sortTasks);