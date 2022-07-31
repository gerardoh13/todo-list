const ol = document.getElementById("ol");
const todoForm = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const fName = document.getElementById("name");
const check = document.getElementById("check");
const submitName = document.getElementById("submitName");
let dragging;
let draggedOver;
let draggingStrike;
let draggedOverStrike;
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let stricken = JSON.parse(localStorage.getItem("stricken")) || [];
let storedName = localStorage.getItem("fName") || "";
let checked = localStorage.getItem("check") || false;


submitName.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.setItem("fName", fName.value);
  displayName(fName.value);
  $("#welcome").modal("hide");
});
check.addEventListener("change", (e) => {
  if (e.target.checked) {
    localStorage.setItem("check", e.target.checked);
  }
});
// I prevented the user from inputing todos with the same value as it prevents
// finding the index of equal values when rearranging he order of the array.
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (todos.includes(input.value)) {
    alert(
      `You already have that on your todo list! You can rearrange your todos by level of importance by dragging them to the top of the list.`
    );
    return;
  } else if (input.value === "") {
    return;
  }
  todos.push(input.value);
  stricken.push("no");
  renderTodos(todos);
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("stricken", JSON.stringify(stricken));
  todoForm.reset();
});

function renderTodos(arr) {
  ol.innerText = "";
  for (let i = 0; i < arr.length; i++) {
    let listItem = document.createElement("li");
    listItem.innerText = arr[i];
    listItem.classList.add("todo-font");
    listItem.draggable = true;
    if (stricken[i] === "yes") {
      listItem.classList.add("strike");
    }
    let listBtn = document.createElement("button");
    listBtn.classList.add("btn");
    listBtn.innerText = "X";
    let listSpan = document.createElement("span");
    listSpan.innerText = "edit";
    listSpan.classList.add("material-symbols-outlined");
    let line = document.createElement("hr");
    listItem.append(listSpan);
    listItem.append(listBtn);
    listBtn.after(line);
    ol.appendChild(listItem);
  }
}

ol.addEventListener("drag", setDragging);
ol.addEventListener("dragover", setDraggedOver);
ol.addEventListener("drop", dropped);
ol.addEventListener("click", clickHandler);

function clickHandler(e) {
  let target = e.target;
  if (target.tagName === "BUTTON") {
    let toRemove = e.target.parentElement.firstChild.nodeValue;
    let index = todos.indexOf(toRemove);
    todos.splice(index, 1);
    stricken.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("stricken", JSON.stringify(stricken));

    renderTodos(todos);
  } else if (target.tagName === "SPAN") {
    let index = todos.indexOf(e.target.parentElement.firstChild.nodeValue);
    e.target.parentElement.classList.toggle("strike");
    if (stricken[index] === "no") {
      stricken[index] = "yes";
    } else {
      stricken[index] = "no";
    }
    localStorage.setItem("stricken", JSON.stringify(stricken));
  }
}
function setDragging(e) {
  let val = e.target.firstChild.nodeValue;
  dragging = val;
  draggingStrike = stricken[todos.indexOf(val)];
}

function setDraggedOver(e) {
  e.preventDefault();
  draggedOver = e.target.firstChild.nodeValue;
}
function dropped(e) {
  e.preventDefault();
  let index1 = todos.indexOf(dragging);
  let index2 = todos.indexOf(draggedOver);
  todos.splice(index1, 1);
  todos.splice(index2, 0, dragging);
  stricken.splice(index1, 1);
  stricken.splice(index2, 0, draggingStrike);
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("stricken", JSON.stringify(stricken));
  renderTodos(todos);
}
function displayName(name) {
  let possesive;
  if (storedName) {
    possesive =
      storedName.slice(-1) === "s" ? storedName + "'" : storedName + "'s";
  } else if (name) {
    possesive = name.slice(-1) === "s" ? name + "'" : name + "'s";
  } else {
    possesive = "Your";
  }
  document.querySelector("h1").innerText = `${possesive} To-do List`;
}

renderTodos(todos);
displayName();
if (!checked){
    $("#welcome").modal();
}
