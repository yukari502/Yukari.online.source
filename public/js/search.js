var lunrIndex,
    $results,
    pagesIndex;

function initLunr() {
    // First retrieve the index file
    fetch("/index.json")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            pagesIndex = data;
            // Set up lunrjs by declaring the fields we use
            // Also provide their boost level for the ranking
            lunrIndex = lunr(function() {
                this.field("title", { boost: 10 });
                this.field("tags", { boost: 5 });
                this.field("categories", { boost: 5 });
                this.field("contents");
                this.ref("permalink");

                // Integate the data from index.json
                data.forEach(function(page) {
                    this.add(page);
                }, this);
            });

            // After index is ready, checking if a query is provided in the URL
            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('q');
            if(query){
                 document.getElementById('search-input').value = query;
                 search(query);
            }
        })
        .catch(function(err) {
            console.error("Error fetching index.json", err);
        });
}

function search(query) {
    if(!query) {
        $results.innerHTML = "";
        return;
    }
    
    // Find the item in our index corresponding to the lunr one to have more info
    // Lunr result: 
    //  {ref: "/section/page1", score: 0.27253277901960256, matchData: {…}}
    var results = lunrIndex.search(query).map(function(result) {
            return pagesIndex.filter(function(page) {
                return page.permalink === result.ref;
            })[0];
        });
    renderResults(results);
}

function renderResults(results) {
    if (!results.length) {
        $results.innerHTML = "<li>No results found</li>";
        return;
    }

    var html = results.map(function(result) {
        return `
        <li style="margin-bottom: 20px;">
            <h3><a href="${result.permalink}">${result.title}</a></h3>
            <p>${result.contents.substring(0, 150)}...</p>
        </li>
        `;
    }).join("");
    
    $results.innerHTML = html;
}

function init() {
    $results = document.getElementById("results-container");
    var $searchInput = document.getElementById("search-input");

    $searchInput.addEventListener("keyup", function(e) {
        search(e.target.value);
    });

    initLunr();
}

init();
