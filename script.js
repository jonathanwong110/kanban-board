const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");

const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const reviewList = document.getElementById("review-list");
const completeList = document.getElementById("complete-list");

let updatedOnLoad = false;

let backlogListArray = [];
let progressListArray = [];
let reviewListArray = [];
let completeListArray = [];

function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    reviewListArray = JSON.parse(localStorage.reviewItems);
    completeListArray = JSON.parse(localStorage.completeItems);
  } else {
    backlogListArray = ["Brainstore on new project"];
    progressListArray = ["Running performance tests on new function"];
    reviewListArray = ["Check home page"]
    completeListArray = ["Getting things done"];
  }
}

function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    reviewListArray,
    completeListArray,
  ];
  const arrayNames = ["backlog", "progress", "review", "complete"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listArrays[index])
    );
  });
}

function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  columnEl.appendChild(listEl);
}

function updateDOM() {
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);
  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);
  reviewList.textContent = "";
  reviewListArray.forEach((reviewItem, index) => {
    createItemEl(reviewList, 3, reviewItem, index);
  });
  reviewListArray = filterArray(reviewListArray);
  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);
  updatedOnLoad = true;
  updateSavedColumns();
}

function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM();
}

function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}

function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}

function rebuildArrays() {
  backlogListArray = Array.from(backlogList.children).map(item => item.textContent);
  progressListArray = Array.from(progressList.children).map(item => item.textContent);
  reviewListArray = Array.from(reviewList.children).map(item => item.textContent);
  completeListArray = Array.from(completeList.children).map(item => item.textContent);
  updateDOM();
}

updateDOM();