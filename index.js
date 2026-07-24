const MY_API_KEY = "7d6c7720"; 
const DEFAULT_SEARCH = "batman";

// main() now accepts three distinct layout filtering criteria variables
async function main(searchTerm = DEFAULT_SEARCH, typeFilter = "", yearFilter = "") {
    const movieContainerEl = document.querySelector('#main .movie-container');
    if (!movieContainerEl) return;
    
    try {
        const URL = "https://omdbapi.com?apikey=" + MY_API_KEY + "&s=" + searchTerm;
        
        // Append type restriction filter parameter if user selected an option
        if (typeFilter !== "") {
            URL += "&type=" + typeFilter;
        }
        
        // Append individual year constraint filter if user typed one out
        if (yearFilter !== "") {
            URL += "&y=" + yearFilter;
        }

        console.log("Connecting to dynamic filtered resource:", URL);

        const response = await fetch(URL);
        const movieData = await response.json();
        
        if (movieData.Response === "True") {
            movieContainerEl.innerHTML = movieData.Search.map((movie) => movieHTML(movie)).join('');
        } else {
            // Friendly fallback if the API doesn't find a record match
            movieContainerEl.innerHTML = "<p>No matches found with those combined parameters.</p>";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Gathers values from all controls and initiates processing
function executeSearch() {
    const inputVal = document.getElementById('search-input').value;
    const typeVal = document.getElementById('filter-type').value;
    const yearVal = document.getElementById('filter-year').value;
    
    // Default to our fallback keyword if input string space is left empty
    const finalSearch = inputVal.trim() !== "" ? inputVal : DEFAULT_SEARCH;
    
    main(finalSearch, typeVal, yearVal);
}

function showMovie(id) {
    localStorage.setItem("id", id);
    window.location.href = window.location.origin + "/movie.html";
}

function movieHTML(movie) {
    const posterSrc = movie.Poster !== 'N/A' ? movie.Poster : 'https://placeholder.com';
    
    return (
        '<div class="movie-card" onclick="showMovie(\'' + movie.imdbID + '\')">' +
            '<img src="' + posterSrc + '" alt="' + movie.Title + '">' +
            '<div class="movie-card__container">' +
                '<h3>' + movie.Title + '</h3>' +
                '<p><strong>Type:</strong> ' + movie.Type + '</p>' +
                '<p><strong>Year:</strong> ' + movie.Year + '</p>' +
            '</div>' +
        '</div>'
    );
}

// Global actions listener configuration initialization wrapper script block
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                executeSearch();
            }
        });
    }
    
    // OPTIONAL: Automatically refresh the search when the Type selector is changed
    const typeSelect = document.getElementById('filter-type');
    if (typeSelect) {
        typeSelect.addEventListener("change", executeSearch);
    }

    main(); // Run initial render on startup load
});