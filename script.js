let myLibrary = [];
let currentBook = 0
console.log(firebase)
console.log(60)
//localStorage.removeItem('library')
const bookButton = document.querySelector('.bookButton')
const bookInformation = document.querySelector('.bookInformation')
const closeButton = document.querySelector('.closeButton')
const addButton = document.querySelector('.addButton')
const backgroundDisplay = document.querySelector('.display')

const storageButton = document.querySelector('.cloudButton')
const fireInfo = document.querySelector('.fireInfo')
storageButton.addEventListener('click',()=>{
  fireInfo.style.display = 'block'
  backgroundDisplay.style.display = 'block'
});

var provider = new firebase.auth.GoogleAuthProvider();
var user = ''

const enterButton = document.querySelector('.enter')

enterButton.addEventListener('click',()=>{
  
  
  firebase.auth().signInWithPopup(provider).then(function(result) {
    
  
    user = result.user;
    
    
  }).catch(function(error) {
    console.log(error.message)
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
  });
  fireInfo.style.display = 'none'
  backgroundDisplay.style.display = 'none'
});

const signOut = document.querySelector('.signOut')
signOut.addEventListener('click',()=>{
  
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
  
  
  //fireInfo.style.display = 'none'
  //backgroundDisplay.style.display = 'none'
});
// Book constructor function
function Book(title,author,pages,read) {
    this.title = title,
    this.author = author,
    this.pages = pages,
    this.read = read
}

// Two functions that control the shaded background display when entering information
bookButton.addEventListener('click',()=>{
  bookInformation.style.display = 'block'
  backgroundDisplay.style.display = 'block'
  var userID = user.getIdToken()
  firebase.database().ref('users/' + userID).set(myLibrary);
  

 
});

closeButton.addEventListener('click',()=>{
  bookInformation.style.display = 'none'
  backgroundDisplay.style.display = 'none'
});

addButton.addEventListener('click',addBookToLibrary)

function addBookToLibrary(){
  // Grab all user inputs from the book information box
    var titleInput = document.querySelector('#title').value
    var authorInput = document.querySelector('#author').value
    var pagesInput = document.querySelector('#pages').value
    var checkBox = document.querySelector('#check')

    var checkBoxData = ''
    var numberOfInputs = 0

    if (titleInput){
        numberOfInputs += 1
    }else{
        alert('Please Include a Book Title')
    }
    if (authorInput){
        numberOfInputs += 1
    }else{
        alert('Please Include the books Author')
    }
    if (pagesInput){
        numberOfInputs += 1
    }else{
        alert('Please Include the number of pages')
    }
    if (checkBox.checked){
      checkBoxData = 'Read'
    }else{
      checkBoxData = 'Not Read'
    }
    if (numberOfInputs == 3){
      // Create new book object with user information
      let newBook = new Book(titleInput,authorInput,pagesInput,checkBoxData)
      myLibrary.push(newBook)
      localStorage.setItem('library',JSON.stringify(myLibrary))
      bookInformation.style.display = 'none'
      backgroundDisplay.style.display = 'none'
      return appendBook(newBook)
    
  }
}

function appendBook(newBook){
  // Create book div and add all necessary information
    const newDiv = document.createElement("div"); 
    newDiv.classList.add("book");
       
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title");
    titleDiv.innerHTML += newBook.title;

    const authorDiv = document.createElement("div");
    authorDiv.innerHTML += newBook.author
    authorDiv.classList.add("info");

    const pagesDiv = document.createElement("div");
    pagesDiv.innerHTML += `Pages: ${newBook.pages}`;
    pagesDiv.classList.add("pageInfo");

    const readButton = document.createElement("button");
    readButton.classList.add("readButton");
    
    const colorObj = {'Read':'#00d600','Not Read':'#eb0800'}
    readButton.innerHTML = newBook.read
    readButton.style.background = colorObj[newBook.read]

      // Save the array index for each book so the read status on the book object can be changed
       var index = currentBook
       function changeReadStatus(){
        var bookIndex = index
        if (myLibrary[bookIndex].read == 'Read'){
          myLibrary[bookIndex].read = 'Not Read'
          readButton.innerHTML = myLibrary[bookIndex].read 
          readButton.style.background = '#eb0800'
        } else{
          myLibrary[bookIndex].read = 'Read'
          readButton.innerHTML = myLibrary[bookIndex].read 
          readButton.style.background = '#00d600'
        }
        localStorage.setItem('library',JSON.stringify(myLibrary))
     }
      readButton.addEventListener('click',changeReadStatus)
          
       newDiv.appendChild(titleDiv); 
       newDiv.appendChild(authorDiv);
       newDiv.appendChild(pagesDiv);

       const removeButton = document.createElement("button");
       removeButton.classList.add("removeButton");
       removeButton.innerHTML += 'Remove'
       
       // Remove feature based on current books index in the library
       removeButton.addEventListener('click',(e)=>{
         var removeIndex = newBook
         
         myLibrary.splice(myLibrary.findIndex(a => a.title == removeIndex.title) , 1)

         localStorage.setItem('library',JSON.stringify(myLibrary))
         return e.target.parentNode.remove()
  });
       newDiv.appendChild(readButton);
       newDiv.appendChild(removeButton);
       const container = document.querySelector('.container')
       container.appendChild(newDiv);
       currentBook = currentBook + 1
    }
  
// Check local storage for a saved library
function checkStorage(){
  if (localStorage.getItem('library') == null){
    console.log('none')
  }else{
    myLibrary = localStorage.getItem('library')
    myLibrary = JSON.parse(myLibrary)
     for(var i = 0; i < myLibrary.length; i++){
       appendBook(myLibrary[i])
      }
  }
}
checkStorage()
