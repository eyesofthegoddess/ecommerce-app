const MY_API_KEY = "7d6c7720"; 
const DEFAULT_SEARCH = "batman";
async function main(searchTerm = "", typeFilter = "", yearFilter = "") {
    const movieContainerEl = document.querySelector('#main .movie-container');
    if (!movieContainerEl) return;
    if (!searchTerm || searchTerm.trim() === "") {
        movieContainerEl.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #636363;">
                <p>Please enter a movie title in the search box to begin filtering.</p>
            </div>`;
        return; 
    }
    movieContainerEl.innerHTML = `
        <div class="loading-wrapper">
            <div class="spinner"></div>
        </div>`;
    try {
        const params = new URLSearchParams();
        params.append("apikey", MY_API_KEY);
        params.append("s", searchTerm.trim());
        if (typeFilter && typeFilter.trim() !== "") {
            params.append("type", typeFilter.trim());
        }
        if (yearFilter && yearFilter.trim().length === 4) {
            params.append("y", yearFilter.trim());
        }
        const URL = "https://www.omdbapi.com/?" + params.toString();
        console.log("Connecting to dynamic filtered resource:", URL);
        const response = await fetch(URL);
        const movieData = await response.json();
        if (movieData.Response === "True") {
            movieContainerEl.innerHTML = movieData.Search.map((movie) => movieHTML(movie)).join('');
        } else {
            movieContainerEl.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #636363;">
                    <p>No matches found for <strong>"${searchTerm}"</strong> with your selected filters.</p>
                    <small>Try adjusting your filters or checking your spelling.</small>
                </div>`;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        movieContainerEl.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: red;">Failed to load data. Please check your connection.</p>`;
    }
}
function clearFilters() {
    document.getElementById('search-input').value = "";
    document.getElementById('filter-type').value = "";
    document.getElementById('filter-year').value = "";
    main("", "", "");
}
function executeSearch() {
    const inputVal = document.getElementById('search-input').value;
    const typeVal = document.getElementById('filter-type').value;
    const yearVal = document.getElementById('filter-year').value;
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
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                executeSearch();
            }
        });
    }
    const typeSelect = document.getElementById('filter-type');
    if (typeSelect) {
        typeSelect.addEventListener("change", executeSearch);
    }
    main(); 
});