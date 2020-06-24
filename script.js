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
        if(!rating[rating.length - 1].checked){
            return "0"
        }
    }
}

addBtn.addEventListener("click", addBook)
closeBtn.addEventListener("click", closeAddBook)


// create an empty string to store my database (library) 
let library = ""

// create an array to store the table of books (bookshelf) and a list tokeey the keys
let bookshelf = []
let booklist = []

//book constructor function 
function Book(title, author, pages, read, rating, comments, id) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
    this.rating = rating
    this.comments = comments
    this.id = id
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
    let id = "book-"+ (bookshelf.length + 1)
    return (new Book(title, author, pages, read, rating, comments, id))
    
}

const writeBook = (book, i) => {
let row = document.createElement('div')
row.classList.add("row")
row.classList.add("no-gutters")
row.id = "book-"+ [i + 1]

//These need to be done in order due to objects not storing data in order inputted instead they are sorted alphabetically
//Append title colum to row
let titleDIV = document.createElement('div')
titleDIV.classList.add("col-xs-4", "col-sm-4", "col-md-4", "col-lg-4")
row.appendChild(titleDIV)

//Append author column to row
let authorDIV = document.createElement('div')
authorDIV.classList.add("col-xs-2", "col-sm-2", "col-md-2", "col-lg-2")
row.appendChild(authorDIV)

//Append pages column to row
let pagesDIV = document.createElement('div')
pagesDIV.classList.add("col-xs-2", "col-sm-2", "col-md-2", "col-lg-2")
row.appendChild(pagesDIV)

//Append read colum to row
let readDIV = document.createElement('div')
readDIV.classList.add("col-xs-2", "col-sm-2", "col-md-2", "col-lg-2")

for (let [key, value] of Object.entries(book)) {
    if(key === "title"){
        titleDIV.innerHTML = value
        continue
    }
    if(key === "author"){
        authorDIV.innerHTML = value
        continue
    }
    if(key === "pages"){
        pagesDIV.innerHTML = value
        continue
    }
    if(key === "read"){
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

        let key = booklist[i]
        let updateDB = firebase.database().ref("BOOKS/" + key)

        updateDB.update({
            id: "book-"+ [i + 1]
        })
    }
}


//submit form i.e. saving new book to list 
addForm.addEventListener('submit', (e) => {
    // 1.Blocks default submit functionality
    e.preventDefault()
    // 2. Create new book with values submitted 
    let newBook = createBook()
    // 3. push to database
    addDB(newBook)
    // 4. create book element to display in table 
    renderDB(bookshelf)
    // 5. clear and close form 
    addForm.reset()
    closeAddBook()
})




// apply event listeners to all elements to toggle read and delete
document.addEventListener('click', e => {
    

    // Delete element 
    if(e.target.className === "las la-trash-alt text-danger"){
        let id = e.target.parentNode.parentNode.parentNode.id // book-[i]
        let book = bookshelf.find(book => book.id == id)
        let index = bookshelf.indexOf(book)
        let key = booklist[index]
        let updateDB = firebase.database().ref("BOOKS/" + key)

        if (confirm("Are you sure you want to remove this book from the library?")) {
            updateDB.remove()
        }
    }

    // Toggle between read and unread
    if(e.target.className === "las la-check text-success" || e.target.className === "las la-times text-danger"){
        let id = e.target.parentNode.parentNode.parentNode.id // book-[i]
        let book = bookshelf.find(book => book.id == id)
        let index = bookshelf.indexOf(book)
        let key = booklist[index]
        let updateDB = firebase.database().ref("BOOKS/" + key)
        
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

        updateDB.update({
            read: book.read
        })
    }
})


    //FIREBASE DATABASE CODE

    // Get a reference to the database service
    const database = firebase.database().ref();

    // Create a child of the database called BOOKS
    const dbBooks = database.child('BOOKS')

    // Pull from database and render
    const renderDB = bookshelf => {
        table.innerHTML = ""
        for(let i = 0; i < bookshelf.length; i++){
            console.log(bookshelf[i], i)
            writeBook(bookshelf[i], i)
        }
    }

    // Add book to database
    const addDB = (book) => {
        const autoId = dbBooks.push().key
        dbBooks.child(autoId).set({
            title: book.title,
            author: book.author,
            pages: book.pages,
            read: book.read,
            rating: book.rating,
            comments: book.comments,
            id: book.id
        })
    }

    //when database updates page updates 
    // (could also leave this as page interacts instantly and then just display on refresh/relaod)
    dbBooks.on('value', snap => {
        if(snap.val() === null){
            bookshelf = [{
                author: "Benjamin Gambling", 
                comments: "Bread Making Book", 
                id: "book-1", 
                pages: "69", 
                read: "read",
                rating: "5",
                title: "Bens Buns"
                }]
            renderDB(bookshelf)
        } else {
            // library updates whenever database is changed
            library = snap.val()
            //library is put into array 
            bookshelf = Object.values(library)
            booklist = Object.keys(library)
            //update display + book-[i]
            renderDB(bookshelf)
            reassignId()
        }
        
    }) 


    //other methods that can be used to be more effiecnet (will follow up)
    dbBooks.on('child_changed', snap => {
        
    })

    dbBooks.on('child_removed', snap => {

    })

    dbBooks.on('child_added', snap => {

    })
    


    


    

    