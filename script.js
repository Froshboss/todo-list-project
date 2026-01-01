const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
    const task = inputBox.ariaValueMax.trim();
    if (!task) {
        alert("Please write down a task");
        return;
    }
}

const li = document.createElement("li");