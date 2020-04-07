document.addEventListener("DOMContentLoaded", function() {});

fetchBooks()
// fetch books all books from api //
function fetchBooks(){

    fetch("http://localhost:3000/books")
    .then(resp => resp.json())
    .then(data => {
        console.log(data)
        renderBooks(data)
    })
}

function renderBooks(data){
    let foundUl = document.querySelector("#list")
    for (book of data) {
       let bookName = document.createElement("li")
       bookName.innerText = book.title
       foundUl.appendChild(bookName)
       viewBookinfo(book, bookName)
       

    }
}


// click to view book info //
function viewBookinfo(book, bookName){
    
bookName.addEventListener("click", function(e){
    let foundShow = document.querySelector("#show-panel")
    while (foundShow.firstChild){
        foundShow.firstChild.remove()
    }
        let bookImage = document.createElement('img')
        let bookDesc  = document.createElement("p")

        bookImage.src = book.img_url
        bookDesc.innerText = book.description
        foundShow.appendChild(bookImage)
        foundShow.appendChild(bookDesc)

        likeUser(book, foundShow)

})
}

///Show liked users and like user ///
function likeUser(book, foundShow) {
for (user of book.users){
    let bookLiked = document.createElement("h3")
    bookLiked.innerText = user.username
    foundShow.appendChild(bookLiked)
}
let likeBtn = document.createElement("button")
likeBtn.innerText = "like"
foundShow.appendChild(likeBtn)


likeBtn.addEventListener("click", function(e){
    
    let currentLikes = book.users
    
    let data = 
        {
        "id": 1,
        "username": "Spencer"
        }
        currentLikes.push(data)
        console.log(currentLikes)
debugger
console.log(book.users)
console.log(currentLikes)
    // console.log(book.id)
    fetch(`http://localhost:3000/books/${book.id}`,{
        method: 'PATCH', // or 'PUT'
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({users: currentLikes}),
        })
        .then((response) => response.json())
        .then((data) => {
        console.log('Success:', data);
        })
    })
    }



