let likeStatus = false
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM loaded...")
    renderBooks()
});


//Fetches all Books and Renders them
function renderBooks() {
    fetch("http://localhost:3000/books")
        .then(resp => resp.json())
        .then(books => {
            console.log(books)
            let bookParent = document.querySelector("#list")
            let booksHeader = document.createElement("h1")
            booksHeader.innerText = "All Books"
            bookParent.appendChild(booksHeader)
                //Create div for each li including title, description, img_url
            books.forEach(book => {
                //Grab Title
                let wholeBook = document.createElement("h3")
                wholeBook.innerText = book.title
                wholeBook.id = book.id
                wholeBook.addEventListener("click", function(e) {
                        console.log("click")
                        renderBookDetails(book)
                    })
                    //Slap wholeBook to li and slap li to parent 
                let bookLi = document.createElement("li")
                bookLi.appendChild(wholeBook)
                bookParent.appendChild(bookLi)
            })
        })
}

function renderBookDetails(book) {
    let bookDetailParent = document.querySelector("#show-panel")
        //Clean Panel for next Book
    while (bookDetailParent.firstElementChild) {
        bookDetailParent.firstElementChild.remove()
    }
    let bookDetails = document.createElement("div")
    bookDetails.id = book.id
        //Grab Image
    let bookImage = document.createElement("img")
    bookImage.src = book.img_url
        //Grab Desc
    let bookDesc = document.createElement("p")
    bookDesc.innerText = book.description
        //Grab Users Who Like this Ish
    let usersWhoLike = document.createElement("ul")
    let usersWhoLikeTitle = document.createElement("h4")
    usersWhoLikeTitle.innerText = "Users Who Like This Book"
    usersWhoLike.appendChild(usersWhoLikeTitle)
        //Grab each user from the book
    book.users.forEach(user => {
            let userName = document.createElement("li")
            userName.innerText = user.username
            userName.id = user.id
            usersWhoLike.appendChild(userName)
        })
        //Create Like button with Event Listener
    let likeBtn = document.createElement("button")
    likeBtn.innerText = "Like This Ish?!"
    likeBtn.addEventListener("click", function(e) {
            //See if user already likes this ish
            if (likeStatus === false) {
                //Grab all existing users who like this ish
                usersArray = []
                let existingUsers = e.target.parentElement.getElementsByTagName("li")
                Array.from(existingUsers).forEach(user => {
                    usersArray.push({
                        id: user.id,
                        username: user.innerText
                    })
                })
                usersArray.push({
                    id: "1",
                    username: "pouros"
                })
                likeStatus = true
            } else {
                usersArray = []
                let existingUsers = e.target.parentElement.getElementsByTagName("li")
                Array.from(existingUsers).forEach(user => {
                    usersArray.push({
                        id: user.id,
                        username: user.innerText
                    })
                })
                usersArray.pop()
                likeStatus = false
            }

            fetch(`http://localhost:3000/books/${e.target.parentElement.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        users: usersArray
                    })
                })
                .then(response => response.json())
                .then(updatedBook => {
                    console.log(updatedBook)
                    while (document.querySelector("#list").firstElementChild) {
                        document.querySelector("#list").firstElementChild.remove()
                    }
                    while (document.querySelector("#show-panel").firstElementChild) {
                        document.querySelector("#show-panel").firstElementChild.remove()
                    }
                    renderBooks()
                    renderBookDetails(updatedBook)
                })
        })
        //Slap Book details on parent
    bookDetails.append(bookImage, bookDesc, usersWhoLike, likeBtn)
    bookDetailParent.appendChild(bookDetails)

}