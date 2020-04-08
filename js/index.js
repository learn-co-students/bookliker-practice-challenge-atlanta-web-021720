document.addEventListener("DOMContentLoaded", function() {
    const bookSidebar = document.querySelector('#list')
    const bookDetailPanel = document.querySelector('#show-panel')

    fetch('http://localhost:3000/books')
    .then(r => r.json())
    .then(booksData => {
        booksData.forEach(book => {
            renderSidebar(book)
        })
    })
    
    /////////////////////////////////////////////////////
    //        event listeners

    function addSidebarBookListener(li) { 
        li.addEventListener('click', (e) => {
            renderDetails(e.target.dataset.id)
        })
    }

    function addReadBtnListener(button, bookDeets) {
        button.addEventListener('click', (e) => {
            e.preventDefault()
            let usersArr = [...bookDeets.users]
            fetch('http://localhost:3000/users/1')
            .then(r => r.json())
            .then(user => {
                usersArr.push(user)
                let updateObj = {
                    users: usersArr
                }
                fetch(`http://localhost:3000/books/${e.target.dataset.id}`, {
                    method: 'PATCH',
                    headers: {
                        "Content-type": "application/json",
                        Accept: "application/json"
                    },
                    body: JSON.stringify(updateObj)
                })
                .then(r => r.json())
                .then(bookDeets => {
                    renderDetails(bookDeets.id.toString())
                })
                
                
                })

        })

        //then render details with bookDeets
    }






    /////////////////////////////////////////////////////
    //        render helpers

    function renderSidebar(book) {
        bookLi = document.createElement('li')
        bookLi.textContent = book.title
        bookLi.dataset.id = book.id
        addSidebarBookListener(bookLi)
        bookSidebar.append(bookLi)
    }

    function renderDetails(id) {
        bookDetailPanel.innerHTML = ""
        fetch(`http://localhost:3000/books/${id}`)
        .then(r => r.json())
        .then( bookDeets => {
            let title = document.createElement('h3')
            title.textContent = bookDeets.title
            let thumbnail = document.createElement('img')
            thumbnail.src = bookDeets.img_url
            thumbnail.alt = bookDeets.title
            let desc = document.createElement('p')
            desc.textContent = bookDeets.description
            let userList = document.createElement('ul')
            let userHead = document.createElement('h4')
            userHead.textContent = "Users"
            userList.append(userHead)
            bookDeets.users.forEach(user => {
                let li = document.createElement('li')
                li.textContent = user.username
                userList.append(li)
            })
            let readBtn = document.createElement('button')
            readBtn.type = 'submit'
            readBtn.textContent = 'Read'
            readBtn.dataset.id = bookDeets.id
            addReadBtnListener(readBtn, bookDeets)
            bookDetailPanel.append(title, thumbnail, desc, userList, readBtn)
        })
    }


});
