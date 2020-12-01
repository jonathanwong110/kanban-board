const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");

const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const onHoldList = document.getElementById("review-list");
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