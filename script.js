const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveTaskBtns = document.querySelectorAll(".solid");
const addTaskContainers = document.querySelectorAll(".add-container");
const addTasks = document.querySelectorAll(".add-task");

const listColumns = document.querySelectorAll(".drag-task-list");
const toDoList = document.getElementById("to-do-list");
const progressList = document.getElementById("progress-list");
const reviewList = document.getElementById("review-list");
const completeList = document.getElementById("complete-list");

let updatedOnLoad = false;

let toDoListArray = [];
let progressListArray = [];
let reviewListArray = [];
let completeListArray = [];
let listArrays = [];

let draggedTask;
let dragging = false;
let currentColumn;

function getSavedColumns() {
  if (localStorage.getItem("toDoTasks")) {
    toDoListArray = JSON.parse(localStorage.toDoTasks);
    progressListArray = JSON.parse(localStorage.progressTasks);
    reviewListArray = JSON.parse(localStorage.reviewTasks);
    completeListArray = JSON.parse(localStorage.completeTasks);
  } else {
    toDoListArray = ["Run performance tests", "Improve RESTful API"];
    progressListArray = ["Implement JWT", "Incorporate new icons"];
    reviewListArray = ["Replace fetch with axios", "Build edit feature for all objects created"];
    completeListArray = ["Finish Auth functionality", "Updated UI"];
  }
}

function updateSavedColumns() {
  listArrays = [
    toDoListArray,
    progressListArray,
    reviewListArray,
    completeListArray,
  ];
  const arrayNames = ["toDo", "progress", "review", "complete"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Tasks`,
      JSON.stringify(listArrays[index])
    );
  });
}

function filterArray(array) {
  const filteredArray = array.filter((task) => task !== null);
  return filteredArray;
}

function createTaskEl(columnEl, column, task, index) {
  const listEl = document.createElement("li");
  listEl.classList.add("drag-task");
  listEl.textContent = task;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateTask(${index}, ${column})`);
  columnEl.appendChild(listEl);
}

function updateDOM() {
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  toDoList.textContent = "";
  toDoListArray.forEach((toDoTask, index) => {
    createTaskEl(toDoList, 0, toDoTask, index);
  });
  toDoListArray = filterArray(toDoListArray);
  progressList.textContent = "";
  progressListArray.forEach((progressTask, index) => {
    createTaskEl(progressList, 1, progressTask, index);
  });
  progressListArray = filterArray(progressListArray);
  reviewList.textContent = "";
  reviewListArray.forEach((reviewTask, index) => {
    createTaskEl(reviewList, 2, reviewTask, index);
  });
  reviewListArray = filterArray(reviewListArray);
  completeList.textContent = "";
  completeListArray.forEach((completeTask, index) => {
    createTaskEl(completeList, 3, completeTask, index);
  });
  completeListArray = filterArray(completeListArray);
  updatedOnLoad = true;
  updateSavedColumns();
}

function updateTask(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}

function addToColumn(column) {
  const taskText = addTasks[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(taskText);
  addTasks[column].textContent = "";
  updateDOM();
}

function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveTaskBtns[column].style.display = "flex";
  addTaskContainers[column].style.display = "flex";
}

function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveTaskBtns[column].style.display = "none";
  addTaskContainers[column].style.display = "none";
  addToColumn(column);
}

function rebuildArrays() {
  toDoListArray = Array.from(toDoList.children).map(task => task.textContent);
  progressListArray = Array.from(progressList.children).map(task => task.textContent);
  reviewListArray = Array.from(reviewList.children).map(task => task.textContent);
  completeListArray = Array.from(completeList.children).map(task => task.textContent);
  updateDOM();
}

function drag(e) {
  draggedTask = e.target;
  dragging = true;
}

function dragEnter(column) {
  listColumns[column].classList.add("over");
  currentColumn = column;
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedTask);
  dragging = false;
  rebuildArrays();
}

updateDOM();