//Import class
import { ToDo } from "./todo.js";
import { ToDoList } from "./todoList.js";

let todoList = new ToDoList();
let completeList = new ToDoList();

const getELE = id => {
  return document.getElementById(id);
}

//Function add todo
const addToDo = () => {
  let txtToDo = getELE("newTask").value;
  let ulToDo = getELE("todo");
  
  if (txtToDo != "") {
    let td = new ToDo(txtToDo, "todo");
    todoList.addToDo(td);
  }
  
  showToDoList(ulToDo);
  saveToDoList();
  getELE("newTask").value = "";
}
// click button add todo
getELE("addItem").addEventListener("click", () => {
  addToDo();
  saveToDoList();
});

const showToDoList = (ulToDo) => {
  ulToDo.innerHTML = todoList.renderToDo();
}
const showCompleteList = (ulCompleted) => {
  ulCompleted.innerHTML = completeList.renderToDo();
}

//function delete todo
const deleteToDo = (e) => {
  let tdIndex = e.currentTarget.getAttribute("data-index");
  let status = e.currentTarget.getAttribute("data-status");
  let ulToDo = getELE("todo");
  let ulCompleted = getELE("completed");
  if (status == "todo") {
    todoList.removeToDo(tdIndex);
    showToDoList(ulToDo);
    saveToDoList();
  } else if (status == "completed") {
    completeList.removeToDo(tdIndex);
    showCompleteList(ulCompleted);
    saveToDoList();
  } else {
    alert("Cannot delete todo!");
  }
}

window.deleteToDo = deleteToDo;

const completeToDo = (e) => {
  let tdIndex = e.currentTarget.getAttribute("data-index");
  let status = e.currentTarget.getAttribute("data-status");
  let ulToDo = getELE("todo");
  let ulCompleted = getELE("completed");

  if (status == "todo") {
    // slice: start <=index <end
    let completedItem = todoList.tdList.slice(tdIndex, tdIndex + 1);
    let objToDo = new ToDo(completedItem[0].textTodo, "completed");
    moveToDo(todoList, completeList, objToDo, tdIndex);
    showToDoList(ulToDo);
    showCompleteList(ulCompleted);
    saveToDoList();
  } else if (status == "completed") {
    let undoItem = completeList.tdList.slice(tdIndex, tdIndex + 1);
    let objToDo = new ToDo(undoItem[0].textTodo, "todo");
    moveToDo(completeList, todoList, objToDo, tdIndex);
    showToDoList(ulToDo);
    showCompleteList(ulCompleted);
    saveToDoList();
  } else {
    alert("Cannot move todo !");
  }
}

window.completeToDo = completeToDo;

const moveToDo = (depart, arrival, obj, tdIndex) => {
  //Remove todo from depart
  depart.removeToDo(tdIndex);

  //Add todo to arrival
  arrival.addToDo(obj);
}

const sortASC = () => {
  let ulToDo = getELE("todo");
  todoList.sortToDoList(false);
  showToDoList(ulToDo);
}

window.sortASC = sortASC;

const sortDES = () => {
  let ulToDo = getELE("todo");
  todoList.sortToDoList(true);
  showToDoList(ulToDo);
}

window.sortDES = sortDES;

function date(){
  var today = new Date();
  var years = today.getFullYear();
  var month = today.getMonth() + 1;
  var day = today.getDate();
  document.getElementById("years").innerHTML = years;
  document.getElementById("month").innerHTML = month;
  document.getElementById("day").innerHTML = day;
}
setInterval(date, 1000);

function saveToDoList() {
  let todolist = document.querySelectorAll('li');
  let todoStorage = [];
  todolist.forEach((item) => {
    let value = item.querySelector('span').innerText;
    let status = item.querySelector('button').getAttribute('data-status');
    let obj = {
      value: value,
      status: status
    }
    todoStorage.push(obj); 
  });
  localStorage.setItem('todolist', JSON.stringify(todoStorage));
}
// render todo list from local storage when page load 
window.addEventListener('load', () => {
  let todolist = JSON.parse(localStorage.getItem('todolist'));
  if (todolist) {
    todolist.forEach((item) => {
      let obj = new ToDo(item.value, item.status);
      if (item.status == "todo") {
        todoList.addToDo(obj);
      } else if (item.status == "completed") {
        completeList.addToDo(obj);
      }
    });
  }
  let ulToDo = getELE("todo");
  let ulCompleted = getELE("completed");
  showToDoList(ulToDo);
  showCompleteList(ulCompleted);
});