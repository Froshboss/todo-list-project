const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

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
}

editBtn.addEventListener("click", function () {
  const update = prompt("Edit task:", taskSpan.textContent);
  if (update !== null) {
    taskSpan.textContent = update;
    li.classList.remove("completed");
  }
});