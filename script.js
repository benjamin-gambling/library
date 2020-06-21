const addBtn = document.getElementById("add")
const addBackground = document.getElementById("add-background")
const header = document.getElementById("header")
const tabletop = document.getElementById("tabletop")
const table = document.getElementById("table")
const closeBtn = document.getElementById("closeAdd")

//Add book
const addForm = document.getElementById("add-form")
const addTitle = document.getElementById("addTitle")
const addAuthor = document.getElementById("addAuthor")
const addPages = document.getElementById("addPages")
const addNotRead = document.getElementById("addNotRead")
const addRead = document.getElementById("addRead")
const rating = document.getElementsByName('rating')
const addComments = document.getElementById("addComments")

const addBook = () => {
    addBackground.classList.remove("hidden")
    header.classList.add("blur")
    tabletop.classList.add("blur")
    table.classList.add("blur")
}

const closeAddBook = () => {
    addBackground.classList.add("hidden")
    header.classList.remove("blur")
    tabletop.classList.remove("blur")
    table.classList.remove("blur")
}
const toggleRead = () => {
    console.log(readBtn)
}

const deleteBook = () => {
    console.log(deleteBtn)
}

// finds rating by looping through the node.length and checking if the radio button is checked
const getRating = () => {
    for(let i = 0; i < rating.length; i++){
        if(rating[i].checked){
            return rating[i].value
        }
    }
}

addBtn.addEventListener("click", addBook)
closeBtn.addEventListener("click", closeAddBook)

// create an array to store the table of books (bookshelf)
let bookshelf = []

//book constructor function 
function Book(title, author, pages, read, rating, comments, id) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
    this.rating = rating
    this.comments = comments
    this.id = "book-"+ (bookshelf.length + 1)
}

// check if book has been read 
const readOrNot = () => addRead.checked ? "read" : "not read"

// determine icon 
const readIcon = value => {
    let icon = document.createElement('i')
    if(value === "read"){
        icon.classList.add("las", "la-check", "text-success")
    } else {
        icon.classList.add("las", "la-times", "text-danger")
    }
    let button = document.createElement('button')
    button.id = "read"
    button.appendChild(icon)
    return button
}

//create book using constructor function 
const createBook = () => {
    let title = addTitle.value
    let author = addAuthor.value
    let pages = addPages.value
    let read = readOrNot()
    let rating = getRating()
    let comments = addComments.value
    return (new Book(title, author, pages, read, rating, comments))
}

const writeBook = book => {
let row = document.createElement('div')
row.classList.add("row")
row.classList.add("no-gutters")
row.id = "book-"+ bookshelf.length
for (let [key, value] of Object.entries(book)) {
    if(key === "title"){
        let titleDIV = document.createElement('div')
        titleDIV.innerHTML = value
        titleDIV.classList.add("col-xs-4", "col-sm-4", "col-md-4", "col-lg-4")
        row.appendChild(titleDIV)
        continue
    }
    if(key === "author"){
        let authorDIV = document.createElement('div')
        authorDIV.innerHTML = value
        authorDIV.classList.add("col-xs-2", "col-sm-2", "col-md-2", "col-lg-2")
        row.appendChild(authorDIV)
        continue
    }
    if(key === "pages"){
        let pagesDIV = document.createElement('div')
        pagesDIV.innerHTML = value
        pagesDIV.classList.add("col-xs-2", "col-sm-2", "col-md-2", "col-lg-2")
        row.appendChild(pagesDIV)
        continue
    }
    if(key === "read"){
        let readDIV = document.createElement('div')
        readDIV.classList.add("col-xs-2", "col-sm-2", "col-md-2", "col-lg-2")
        let button = readIcon(value)
        readDIV.appendChild(button)
        row.appendChild(readDIV)
        continue
    }  
}
let deleteDIV = document.createElement('div')
deleteDIV.classList.add("col-xs-2", "col-sm-2", "col-md-2", "col-lg-2")
let icon = document.createElement('i')
icon.classList.add("las", "la-trash-alt", "text-danger")
let button = document.createElement('button')
button.id = "trashcan"
button.appendChild(icon)
deleteDIV.appendChild(button)
row.appendChild(deleteDIV)
table.appendChild(row);  
}

// loop througn the nodes and array (both same length when deleted) to assign them ordered ids
const reassignId = () => {
    let nodes = table.childNodes
    for(let i = 0; i < nodes.length; i++){
        nodes[i].id = "book-"+ [i + 1] //assigns element new id
        bookshelf[i].id = "book-"+ [i + 1] //assigns object new id 
    }
}


//submit form i.e. saving new book to list 
addForm.addEventListener('submit', (e) => {
    // 1.Blocks default submit functionality
    e.preventDefault()
    // 2. Create new book with values submitted 
    let newBook = createBook()
    // 3. push new book to the bookshelf array 
    bookshelf.push(newBook)
    // 4. create book element to display in table 
    writeBook(newBook)
    // 5. clear and close form 
    addForm.reset()
    closeAddBook()
})

// apply event listeners to all elements to toggle read and delete
document.addEventListener('click', e => {
    let id = e.target.parentNode.parentNode.parentNode.id // book-[i]
    let book = bookshelf.find(book => book.id == id)

    // Delete element 
    if(e.target.className === "las la-trash-alt text-danger"){
        if (confirm("Are you sure you want to remove this book from the library?")) {
            //remove from array 
            let index = bookshelf.indexOf(book)
            bookshelf.splice(index, 1)
            //remove element
            let bookElement = document.getElementById(id)
            table.removeChild(bookElement)  
            reassignId();
        }
    }

    // Toggle between read and unread
    if(e.target.className === "las la-check text-success" || e.target.className === "las la-times text-danger"){
        if(book.read !== "read"){
            book.read = "read"
        } else if (book.read === "read"){
            book.read = "not read"
        }
        let icon = e.target
        if(book.read === "read"){
            icon.className = "las la-check text-success"
        } else {
            icon.className = "las la-times text-danger"
        }
    }
})

const populateArray = () => {
    let bookdelivery = [
    ["A Game of Thrones", "George R.R. Martin", 694],
    ["A Clash of Kings", "George R.R. Martin", 768],
    ["A Storm of Swords", "George R.R. Martin", 973],
    ["A Feast for Crows", "George R.R. Martin", 753],
    ["Treasure Island", "Robert Louis Stevenson", ""],
    ["Nineteen Eighty-Four", "George Orwell", 328],
    ["To Kill a Mockingbird", "Harper Lee", 281],
    ["Hamlet", "William Shakespeare", 500],
    ["20,000 Leagues Under the Sea", "Jules Verne", 426],
    ["Journey to the Center of the Earth", "Jules Verne", 183],
    ["Adventures of Hucklebery Finn", "Mark Twain", 366]
    ]
    
    for(let i = 0; i < bookdelivery.length; i++){
        let newbook = new Book(bookdelivery[i][0], bookdelivery[i][1], bookdelivery[i][2])
        bookshelf.push(newbook)
        writeBook(newbook)
    }
  }

  window.addEventListener("load", populateArray())

