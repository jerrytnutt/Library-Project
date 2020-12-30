let myLibrary = [];
let currentBook = 0
let editArray = []

const container = document.querySelector('.container')
const addBookButton = document.querySelector('.addBookButton')
const bookInformation = document.querySelector('.bookInformation')
const closeButton = document.querySelector('.closeButton')
const appendButton = document.querySelector('.appendButton')
const backgroundDisplay = document.querySelector('.display')

// Book constructor function
function Book(title,author,pages,read) {
    this.title = title,
    this.author = author,
    this.pages = pages,
    this.read = read
}

// Two functions that control the book info div and shaded background when entering information
addBookButton.addEventListener('click',displayBookInformation)

function displayBookInformation(){
  bookInformation.style.display = 'block'
  backgroundDisplay.style.display = 'block'
 }

closeButton.addEventListener('click',()=>{
  bookInformation.style.display = 'none'
  backgroundDisplay.style.display = 'none'
});

appendButton.addEventListener('click',addBookToLibrary)

function addBookToLibrary(){
  // Grab all user inputs from the book information box
    let titleInput = document.querySelector('#title').value
    let authorInput = document.querySelector('#author').value
    let pagesInput = document.querySelector('#pages').value
    let checkBox = document.querySelector('#check')

  // Check if all inputs were added by user
    if (!titleInput){
      return alert('Please Include a book Title')
    }
    if (!authorInput){
      return alert("Please Include the book's Author")
    }
    if (!pagesInput){
      return alert('Please Include the number of pages')
    }
    if (checkBox.checked){
      checkBox = 'Complete'
    }else{
      checkBox = 'Not Read'
    }

    let newBook = new Book(titleInput,authorInput,pagesInput,checkBox)
    bookInformation.style.display = 'none'
    backgroundDisplay.style.display = 'none'

    // Check if user is adding new book or an editing an existing one
      if(editArray.length == 0){
        myLibrary.push(newBook)
        localStorage.setItem('library',JSON.stringify(myLibrary))
        return appendBook(newBook)

      }else{
        myLibrary[editArray[0]] = newBook
        editArray[1].childNodes[0].innerHTML = titleInput
        editArray[1].childNodes[1].innerHTML = authorInput
        editArray[1].childNodes[2].innerHTML = `Pages: ${newBook.pages}`;
        localStorage.setItem('library',JSON.stringify(myLibrary))
        editArray = []
        return editArray
      }
}

function appendBook(newBook){
  // Create book div and add all necessary information
    const newDiv = document.createElement("div"); 
    newDiv.classList.add("book");
       
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title");
    titleDiv.innerHTML = newBook.title;

    const authorDiv = document.createElement("div");
    authorDiv.innerHTML = newBook.author
    authorDiv.classList.add("author");

    const pagesDiv = document.createElement("div");
    pagesDiv.innerHTML = `Pages: ${newBook.pages}`;
    pagesDiv.classList.add("pagenumber");

    newDiv.appendChild(titleDiv); 
    newDiv.appendChild(authorDiv);
    newDiv.appendChild(pagesDiv);

    const readButton = document.createElement("button");
    readButton.classList.add("readButton");
    readButton.innerHTML = newBook.read
    
    const readButtonColors = {'Complete':'#00d600','Not Read':'#eb0800'}
    readButton.style.background = readButtonColors[newBook.read]

      // Save the array index for each current book so the read status on the correct book object will be changed
      let index = currentBook

       readButton.addEventListener('click',()=>{
        let bookIndex = index
        if (myLibrary[bookIndex].read == 'Complete'){

          myLibrary[bookIndex].read = 'Not Read'
          readButton.innerHTML = myLibrary[bookIndex].read 
          readButton.style.background = '#eb0800'
        } else{

          myLibrary[bookIndex].read = 'Complete'
          readButton.innerHTML = myLibrary[bookIndex].read 
          readButton.style.background = '#00d600'
        }
        localStorage.setItem('library',JSON.stringify(myLibrary))
     });
     
      const editButton = document.createElement("button");
      editButton.classList.add("editButton");
      editButton.innerHTML += 'Edit'

       editButton.addEventListener('click',(e)=>{
         // Save the current book index and the DOM element in editArray
         let selectedBook = myLibrary.findIndex(a => a.title == newBook.title && a.author == newBook.author && a.pages == newBook.pages)
         editArray[0] = selectedBook
         editArray[1] = e.target.parentNode
         return displayBookInformation()
    });

       const removeButton = document.createElement("button");
       removeButton.classList.add("removeButton");
       removeButton.innerHTML += 'Remove'
       
       removeButton.addEventListener('click',(e)=>{
         // Splice out the selected book and remove DOM node
         let removeIndex = newBook
         myLibrary.splice(myLibrary.findIndex(a => a.title == removeIndex.title && a.author == removeIndex.author && a.pages == removeIndex.pages) , 1)
         localStorage.setItem('library',JSON.stringify(myLibrary))
         return e.target.parentNode.remove()
  });
       
       newDiv.appendChild(readButton);
       newDiv.appendChild(editButton);
       newDiv.appendChild(removeButton);

       container.appendChild(newDiv);
       editArray = []
       return currentBook = currentBook + 1
    }

// Check local storage for a saved library
function checkStorage(){
  if (localStorage.getItem('library') == null){
    let theBladeItself = new Book('The Blade Itself','Joe Abercrombie','560','Complete')
    let historyOfTime = new Book('A Brief History of Time','Stephen Hawking','256','Complete')
     myLibrary.push(theBladeItself)
     myLibrary.push(historyOfTime)
     appendBook(theBladeItself)
     appendBook(historyOfTime)
  }else{
    myLibrary = localStorage.getItem('library')
    myLibrary = JSON.parse(myLibrary)
     for(var i = 0; i < myLibrary.length; i++){
       appendBook(myLibrary[i])
      }
  }
}
checkStorage()



