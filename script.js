const getElement = (element) => document.querySelector(element)
const getAllElements = (element) => document.querySelectorAll(element)

const btn = getElement(".btn")
const input = getElement(".input")
const list = getElement(".list")
const doneList = getElement(".done-list")
const cleanBtn = getElement('.clean')

const classes = {
    li: "todo-item list-group-item",
    delBtn: "delBtn",
    updBtn: "updBtn",
    saveBtn: 'save-btn',
    cancelBtn : 'cancel-btn'
}

cleanBtn.addEventListener('click',() => {
    localStorage.clear()
    view()
    renderDone()
})

btn.addEventListener("click", () => {
    if (input.value.trim()  && input.value.length > 3) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || []
        const newObject = {
            id: +new Date(),
            title: input.value,
            isDone: false
        }

        tasks = [...tasks, newObject]
        localStorage.setItem('tasks', JSON.stringify(tasks))

        input.value = ''
        view()
    }
})
view()


function view() {

    let result = ""
    let tasks = JSON.parse(localStorage.getItem('tasks')) || []

    tasks.filter(el => el.isDone === false).forEach(({title, id, isDone}, idx) => {
        const initials = title.split(" ").slice(0, 2)
            .reduce((acc, el) => acc + el[0].toUpperCase(), "")

        result += `
        <li class="todo-item  ${classes.li}">
    
        <div class="gen"> 
            <div class="profile">
                ${initials}
            </div>
            
            <span class="title">${title[0].toUpperCase() + title.slice(1)}</span>
            <input type="text" class="rename-input" value="${title}" style="display: none">
        </div>

             <span class="gen-btn">

                 <input type="checkbox" class="check-todo" id="${id}">
                 <button id="${id}" style="display: none" class="save-btn"><i class="fa-solid fa-check"></i></button>
                 <button class="upd-btn" ${classes.updBtn}><i class="fa-solid fa-pen"></i></button>
                 <button class="del-btn" ${classes.delBtn}><i class="icon fa-solid fa-xmark"></i></button>
                 <button style="display: none" class="cancel-btn ${classes.cancelBtn}"><i class="fa-solid fa-arrow-right"></i></button>
            </span>
    </li>`

    })

    list.innerHTML = result
    deleteTodo()
    checkTodo()
    updateTodo()
}


function deleteTodo() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || []

    const delButtons = getAllElements('.del-btn')
    delButtons.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            let updatedTasks = tasks.filter((el, index) => index !== idx)
            localStorage.setItem('tasks', JSON.stringify(updatedTasks))
            view()
        })
    })
}


function checkTodo() {
    const checkBoxes = getAllElements('.check-todo')
    let tasks = JSON.parse(localStorage.getItem('tasks')) || []
    checkBoxes.forEach((check, idx) => {

        check.addEventListener('change', () => {
            const id = check.getAttribute('id')
            tasks = tasks.map(el => {
                if (el.id === +id){
                    return {...el, isDone: !el.isDone}
                } else {
                    return el
                }
            })

            console.log('tasks', tasks.filter(el => !el.isDone))
            localStorage.setItem('tasks', JSON.stringify(tasks))
            renderDone()
            view()
        })


    })

}

function renderDone() {
    let result = ""
    let tasks = JSON.parse(localStorage.getItem('tasks')) || []
    tasks.filter(el => el.isDone).forEach(({title, id, isDone}, idx) => {

        const initials = title.split(" ").slice(0, 2)
            .reduce((acc, el) => acc + el[0].toUpperCase(), "")
        result += `
           <li class="todo-item ${classes.li}">

              <div class="gen"> 
              <div class="profile">
              ${initials}
              </div>
              <span class="done-title"> ${title[0].toUpperCase() + title.slice(1)}</span>
              </div>

              <span class="gen-btn">

             <input id="${id}" type="checkbox" checked  class="check-todo">

             <button style="display: none" class="upd-btn"><i class="fa-solid fa-pen"></i></button>
             <button class="del-btn"><i class="icon fa-solid fa-xmark"></i></button>
        </span>
</li>`

        doneList.innerHTML = result

        checkTodo()
        view()

    })

}

function updateTodo(){
    let tasks = JSON.parse(localStorage.getItem('tasks')) || []

    const updateButtons = getAllElements('.upd-btn')
    const renameInputs = getAllElements('.rename-input')
    const titles = getAllElements('.title')
    const saveButtons = getAllElements('.save-btn')
    const cancelButtons = getAllElements('.cancel-btn')
    const delButtons = getAllElements('.del-btn')

    updateButtons.forEach((btn,idx) => {

        btn.addEventListener('click', () => {
            cancelButtons[idx].style.display = 'block'
            renameInputs[idx].style.display = 'block'
            saveButtons[idx].style.display = 'block'
            updateButtons[idx].style.display = 'none'
            delButtons[idx].style.display = 'none'
            titles[idx].style.display = 'none'

        })
    })

    saveButtons.forEach((btn,idx) => {
     btn.addEventListener('click',() => {
         renameInputs[idx].style.display = 'none'
         saveButtons[idx].style.display = 'none'
         updateButtons[idx].style.display = 'block'
         titles[idx].style.display = 'block'
         const id = saveButtons[idx].getAttribute('id')

         const updatedTasks = tasks.map((el ,i) => {
             if (el.id === +id){
                 return {...el, title: renameInputs[idx].value}
             } else return el
         })
         localStorage.setItem('tasks', JSON.stringify(updatedTasks))
         view()
     })
    })


    cancelButtons.forEach((btn,idx) => {
        btn.addEventListener('click', () => {
            renameInputs[idx].style.display = 'none'
            saveButtons[idx].style.display = 'none'
            updateButtons[idx].style.display = 'block'
            delButtons[idx].style.display = 'block'
            cancelButtons[idx].style.display = 'none'
            titles[idx].style.display = 'block'
        })
    })
}

