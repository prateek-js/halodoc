var currentPage = 1;
var numberPerPage = 10;
var numberOfPages = 0;
var totalLength = 0;
var dataResult = '';
var pageList = new Array();
var searchResults = document.querySelector('.searchResults');
var type = 'xml';
// update the type of Data Retreival here


function handleSubmit(event) {
    // prevent page from reloading when form is submitted
  event.preventDefault();
  // get the value of the input field
  const input = document.querySelector('.searchForm-input').value;
  // remove whitespace from the input
  const searchQuery = input.trim();
  // call `fetchResults` and pass it the `searchQuery`
  fetchResults(searchQuery);
}

function fetchResults(searchQuery) {
	  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=${type}&origin=*&srlimit=20&srsearch=${searchQuery}`;
        // const endpoint = searchQuery;
        // let url = new URL(endpoint);
        // type = url.searchParams.get("format");
        if(type === 'xml') {  
            fetch(endpoint)
            // .then(response => response.json())
        
            .then(response => response.text())
            .then(xmlString => xmlToJson.parse(xmlString))
            .then(data => {
                dataResult = data.api.query.search.p;
               
                displayResults(dataResult);
            })
            .catch(() => console.log('An error occurred'));
        } else {
            fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                dataResult = data.query.search;
               
                displayResults(dataResult);
            })
            .catch(() => console.log('An error occurred'));
        }
}

function displayResults(results) {
  // Remove all child elements
  searchResults.innerHTML = '';
  // Loop over results array
  if(!dataResult){
    disableAll();
    searchResults.insertAdjacentHTML('beforeend',
        `<div class="resultItem">
            No Results Found
        </div>`
    );
    }
    else {
        numberOfPages = getNumberOfPages(results);
        loadList(results);
    }
}

function getNumberOfPages(data) {
    totalLength = data.length;
    return Math.ceil(data.length / numberPerPage);
}
function nextPage() {
    currentPage += 1;
    loadList();
}
function previousPage() {
    currentPage -= 1;
    loadList();
}

function firstPage() {
    currentPage = 1;
    loadList();
}

function lastPage() {
    currentPage = numberOfPages;
    loadList();
}

function loadList() {
    var begin = ((currentPage - 1) * numberPerPage);
    var end = (begin + numberPerPage);
    searchResults.innerHTML = '';
    pageList = dataResult.slice(begin, end);
    drawList(pageList);
    check();
}

function drawList(pageList) {
  pageList.forEach(result => {
   const url = `https://en.wikipedia.org/wiki/${result.title}`;

   searchResults.insertAdjacentHTML('beforeend',
      `<div class="resultItem">
        <h3 class="resultItem-title">
          <a href="${url}" target="_blank" rel="noopener">${result.title}</a>
        </h3>
        <span class="resultItem-snippet">${result.snippet}</span><br>
        <a href="${url}" class="resultItem-link" target="_blank" rel="noopener">${url}</a>
      </div>`
    );
  });
}

function check() {
    document.getElementById("next").disabled = currentPage == numberOfPages ? true : false;
    document.getElementById("previous").disabled = currentPage == 1 ? true : false;
    document.getElementById("first").disabled = currentPage == 1 ? true : false;
    document.getElementById("last").disabled = currentPage == numberOfPages ? true : false;
}

function disableAll() {
    document.getElementById("next").disabled = true;
    document.getElementById("previous").disabled = true;
    document.getElementById("first").disabled = true;
    document.getElementById("last").disabled = true;
}

const form = document.querySelector('.searchForm');
form.addEventListener('submit', handleSubmit);
