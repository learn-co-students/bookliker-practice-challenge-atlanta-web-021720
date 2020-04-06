document.addEventListener("DOMContentLoaded", function() {
    bookUl = document.querySelector("#list")
    bookShow = document.querySelector("#show-panel")
fetchBooks();

});

function fetchBooks() {
    fetch("http://localhost:3000/books")
    .then(req => req.json())
    .then(bookData => {
        console.log(bookData)
        listBooks(bookData)
    })
}

function listBooks(bookData) {
    bookData.forEach(book => {
        bookTitleLi = document.createElement("li")
        bookTitleLi.innerHTML = book.title

        bookTitleLi.addEventListener("click", (event) => {
            renderBook(book)
        })

        bookUl.appendChild(bookTitleLi)
    })
}

function renderBook(book) {
    // console.log("worked")
    while(bookShow.hasChildNodes()) {
        bookShow.removeChild(bookShow.firstChild)
    }
    let bookTitleH2 = document.createElement("h2")
    bookTitleH2.innerHTML = book.title

    let bookImg = document.createElement("img")
    bookImg.src = book.img_url

    let bookDescP = document.createElement("p")
    bookDescP.innerHTML = book.description

    let bookUserP = document.createElement("h4")
    book.users.forEach(user => {
        bookUserP.innerHTML += `
        ${user.username}<br>
        `
    })

    let bookUserBtn = document.createElement("button")
    bookUserBtn.innerHTML = "Read Book"

    bookUserBtn.addEventListener("click", () => {
        renderUser(book)
    })

    bookShow.append(bookTitleH2, bookImg, bookDescP, bookUserP, bookUserBtn)
}

function renderUser(book) {

    fetch(`http://localhost:3000/users`)
    .then(req => req.json())
    .then(userData => {
        if(book.users[book.users.length - 1].username !== userData[0].username) {
            book.users.push(userData[0])
            fetch(`http://localhost:3000/books/${book.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    users: book.users
                }),
            })
            .then(req => req.json())
            .then(newUserData => {
                renderBook(newUserData)
            })   
        } else {
            book.users.pop(userData[0])
            fetch(`http://localhost:3000/books/${book.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    users: book.users
                }),
            })
            .then(req => req.json())
            .then(newUserData => {
                renderBook(newUserData)
            }) 
        }
    })


}