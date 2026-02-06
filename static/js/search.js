var lunrIndex,
    $results,
    pagesIndex;

function initLunr() {
    // First retrieve the index file
    fetch("/index.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            pagesIndex = data;
            // Set up lunrjs by declaring the fields we use
            // Also provide their boost level for the ranking
            lunrIndex = lunr(function () {
                this.use(lunr.zh);
                this.field("title", { boost: 10 });
                this.field("tags", { boost: 5 });
                this.field("categories", { boost: 5 });
                this.field("contents");
                this.ref("permalink");

                // Integate the data from index.json
                data.forEach(function (page) {
                    this.add(page);
                }, this);
            });

            // After index is ready, checking if a query is provided in the URL
            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('q');
            if (query) {
                document.getElementById('search-input').value = query;
                search(query);
            }
        })
        .catch(function (err) {
            console.error("Error fetching index.json", err);
        });
}

function search(query) {
    if (!query) {
        $results.innerHTML = "";
        return;
    }

    var results;

    // Check if the query contains Chinese characters
    var isChinese = /[\u4e00-\u9fa5]/.test(query);

    if (isChinese) {
        // For Chinese, we rely on lunr.zh to handle tokenization/segmentation.
        // We use the standard .search() method which processes the query string through the pipeline.
        // Fuzzy (edit distance) is usually not useful/accurate for Chinese characters.
        results = lunrIndex.search(query).map(function (result) {
            return pagesIndex.filter(function (page) {
                return page.permalink === result.ref;
            })[0];
        });
    } else {
        // For English/Alphabetic, we use our custom fuzzy/wildcard builder
        // 1. Exact match (High boost)
        // 2. Prefix match (Medium boost) - acts like wildcard *
        // 3. Fuzzy match (Low boost, edit distance 1) - handles typos
        results = lunrIndex.query(function (q) {
            var terms = query.split(/\s+/);
            terms.forEach(function (term) {
                if (term) {
                    // Exact match
                    q.term(term, { boost: 100 });
                    // Prefix match (wildcard)
                    q.term(term, { wildcard: lunr.Query.wildcard.TRAILING, boost: 10 });
                    // Fuzzy match
                    q.term(term, { editDistance: 1, boost: 1 });
                }
            });
        }).map(function (result) {
            return pagesIndex.filter(function (page) {
                return page.permalink === result.ref;
            })[0];
        });
    }

    renderResults(results);
}

function renderResults(results) {
    if (!results.length) {
        $results.innerHTML = "<li>No results found</li>";
        return;
    }

    var html = results.map(function (result) {
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

    $searchInput.addEventListener("keyup", function (e) {
        search(e.target.value);
    });

    initLunr();
}

init();
