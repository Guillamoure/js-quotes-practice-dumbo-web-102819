// Globals
const quoteListContainer = document.getElementById('quote-list')
const newQuoteForm = document.getElementById('new-quote-form')

function initialFetch(){
  fetch("http://localhost:3000/quotes?_embed=likes")
    .then(r => r.json())
    .then(quotes => {
      quoteListContainer.innerHTML = ""
      renderAllQuotes(quotes)
    })
}
initialFetch()


function renderAllQuotes(quotesArray) {
  quotesArray.forEach(renderOneQuote)
}

function renderOneQuote(q){
  const li = document.createElement("li")
  li.className = 'quote-card'

  let likes
  if (q.likes){
    likes = q.likes.length
  } else if (!q.likes){
    likes = 0
  }

  li.innerHTML = `
    <blockquote class="blockquote">
      <p class="mb-0">${q.quote}</p>
      <footer class="blockquote-footer">${q.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${likes}</span></button>
      <button class='btn-danger'>Delete</button>
      <button class='btn-warning'>Edit</button>
    </blockquote>
  `

  quoteListContainer.append(li)

  // grab the above button

  const deleteBtn = li.querySelector(".btn-danger")
  // event listener on that button

  deleteBtn.addEventListener("click", () => {
    // delete fetch to remove it
    fetch(`http://localhost:3000/quotes/${q.id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(r => r.json())
      .then(data => {
        // remove it from dom
        li.remove()
      })
  })

  const likeBtn = li.querySelector(".btn-success")
  likeBtn.addEventListener("click", () => {
    // Use a POST request to http://localhost:3000/likes
    fetch("http://localhost:3000/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({quoteId: parseInt(q.id)})
    })
      .then(r => r.json())
      .then(newLike => {
        // update likes with a new like

        q.likes.push(newLike)
        // Ideas
        // shovel into array---
        // find the innerText of the button, and update it
        const originalNumberOfLikes = parseInt(likeBtn.firstElementChild.innerText)

        likeBtn.firstElementChild.innerText = originalNumberOfLikes + 1

        // access the like variable from above, and update that


        const likesDOM = li.querySelector('span')


      })

  })

  // hidden edit form
  // grab edit button
  const editBtn = li.querySelector(".btn-warning")
  // add event listener to button
  editBtn.addEventListener("click", () => editForm(li, q))
  // display form when button is clicked



  // still in renderOneQuote
}

// The body of the request should be a JSON object containing a key of quoteId, with an integer value. Use the ID of the quote you're creating the like for — e.g. { quoteId: 5 } to create a like for quote 5.






// event listener on Submit
newQuoteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // e.target === newQuoteForm
  const quote = newQuoteForm.quote.value
  const author = newQuoteForm.author.value
  // post fetch

  fetch("http://localhost:3000/quotes", {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json',
      "Response": "application/json"
    },
    body: JSON.stringify({
      quote: quote,
      author: author
    })
  })
    .then(r => r.json())
    .then(newQuote => {
      // render quote
      renderOneQuote(newQuote)
    })

})


function editForm(li, quoteObj) {
  const form = document.createElement('form')
  // console.log(quoteObj)
  form.innerHTML = `
    <div class="form-group">
      <label for="edit-quote">Edit Quote</label>
      <input name="quote" type="text" class="form-control" id="edit-quote" value="${quoteObj.quote}">
    </div>
    <div class="form-group">
      <label for="Author">Author</label>
      <input name="author" type="text" class="form-control" id="author" value="${quoteObj.author}">
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  `

  li.append(form)


  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const quote = form.quote.value
    const author = form.author.value

    fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": 'application/json',
        "Response": "application/json"
      },
      body: JSON.stringify({
        quote: quote,
        author: author
      })
    })
      .then(r => r.json())
      .then(editQuote => {
        console.log("the new quote", editQuote)
        console.log("the original quote", quoteObj)

        const domQuote = li.querySelector(".mb-0")
        const domAuthor = li.querySelector(".blockquote-footer")

        domQuote.innerText = editQuote.quote
        domAuthor.innerText = editQuote.author

        form.remove()

        // initialFetch()
      })
  })
}
