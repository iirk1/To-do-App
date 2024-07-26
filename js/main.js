// Знаходимо елементи на сторінці

const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = []

if (localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask (task));
}


checkEmptyList();

form.addEventListener('submit', addTask);

tasksList.addEventListener('click', deleteTask);

tasksList.addEventListener('click', doneTask);



function addTask (event){
    // відміняємо відправку форми
    event.preventDefault();

    // дістаємо текст задачі з поля вводу
    const taskText = taskInput.value


    // описуємо задачу в вигляді об'єкту
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };
    // добавляєм задачу в масив з задачами 
    tasks.push(newTask);
    

    // зберігаємо задачу в сховище браузера localStorage
    saveToLocalStorage ();


    renderTask (newTask);

    // очищуємо поле вводу і вертаємо на нього фокус
    taskInput.value = "";
    taskInput.focus();

    // якщо є задачі, то "пустий список" скриваємо
    // if(tasksList.children.length > 1){
    //     emptyList.classList.add('none');
    // }

    checkEmptyList();

}

function deleteTask (event) {

    // перевіряємо , що клік відбувся по кнопці "видалити задачу"
    if (event.target.dataset.action !== 'delete') return;
        
    const parentNode = event.target.closest('.list-group-item');

    // оприділяємо id задачі
    const id = Number(parentNode.id);


    // 1 метод
    // // знаходимо індекс задачі в масиві
    // const index = tasks.findIndex( (task) => task.id === id);
    // // видаляємо задачу з масива
    // tasks.splice(index, 1)

    // інший метод видалення заадчі з масиву через фільтр
    tasks = tasks.filter((task) => task.id !== id);

    

    // видаляємо задачу з розмітки
    parentNode.remove();

    // зберігаємо задачу в сховище браузера localStorage
    saveToLocalStorage ()
    

    // якщо в списку задач 1 елемент , тоді показуємо блок "список пустий", тому що 1 елемент це і є елемент пустого списку
    // if(tasksList.children.length === 1){
    //     emptyList.classList.remove('none');
    // }

    checkEmptyList();

}

function doneTask (event){
    // перевіряємо , що клік відбувся по кнопці "виконана задача"
    if (event.target.dataset.action === 'done'){
        const parentNode = event.target.closest('.list-group-item');

        // позначаємо "виконано" через базу даних
        const id = Number(parentNode.id);
        const task = tasks.find( (task) => task.id === id);
        task.done = !task.done

        // зберігаємо задачу в сховище браузера localStorage
        saveToLocalStorage ()

        const taskTitle = parentNode.querySelector('.task-title');
        taskTitle.classList.toggle('task-title--done');
    }

}

function checkEmptyList (){
    if (tasks.length === 0){
        const emptyListElement = `<li id="emptyList" class="list-group-item empty-list">
                                    <img src="./img/leaf.png" alt="Empty" width="70" class="mt-3">
                                    <div class="empty-list__title">the to-do list is empty</div>
                                </li>`;

        tasksList.insertAdjacentHTML('afterbegin', emptyListElement);
    } 
    if (tasks.length > 0){
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage () {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask (task) {
    // формуємо css клас
    const cssClass = task.done ? "task-title task-title--done" : "task-title"; 

    // формуємо розмітку для нової задачі
    const taskHTML = `
                        <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                            <span class="${cssClass}">${task.text}</span>
                            <div class="task-item__buttons">
                                <button type="button" data-action="done" class="btn-action">
                                    <img src="./img/tick.png" alt="Done" width="18" height="18">
                                </button>
                                <button type="button" data-action="delete" class="btn-action">
                                    <img src="./img/cross.png" alt="Done" width="18" height="18">
                                </button>
                            </div>
                        </li>`;


    // добавляємо задачу на сторінку
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}