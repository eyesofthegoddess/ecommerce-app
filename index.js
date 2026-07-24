const MY_API_KEY = "7d6c7720"; 
async function main(searchTerm = "", typeFilter = "", yearFilter = "", sortBy = "") {
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
        const URL = "https://omdbapi.com?" + params.toString();
        const response = await fetch(URL);
        const movieData = await response.json();
        if (movieData.Response === "True") {
            let movies = movieData.Search;
            if (sortBy === "alpha-az") {
                movies.sort((a, b) => a.Title.localeCompare(b.Title));
            } else if (sortBy === "alpha-za") {
                movies.sort((a, b) => b.Title.localeCompare(a.Title));
            } else if (sortBy === "date-new") {
                movies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
            } else if (sortBy === "date-old") {
                movies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
            }
            movieContainerEl.innerHTML = movies.map((movie) => movieHTML(movie)).join('');
        } else {
            movieContainerEl.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #636363;">
                    <p>No matches found for <strong>"${searchTerm}"</strong> with your selected filters.</p>
                </div>`;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        movieContainerEl.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: red;">Failed to load data.</p>`;
    }
}
function executeSearch() {
    const inputVal = document.getElementById('search-input').value;
    const typeVal = document.getElementById('filter-type').value;
    const yearVal = document.getElementById('filter-year').value;
    const sortVal = document.getElementById('filter-sort').value; 
    
    main(inputVal, typeVal, yearVal, sortVal);
}
function clearFilters() {
    document.getElementById('search-input').value = "";
    document.getElementById('filter-type').value = "";
    document.getElementById('filter-year').value = "";
    document.getElementById('filter-sort').value = ""; 
    main("", "", "", "");
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
            if (event.key === "Enter") executeSearch();
        });
    }
    document.getElementById('filter-type')?.addEventListener("change", executeSearch);
    document.getElementById('filter-sort')?.addEventListener("change", executeSearch);

    const yearInput = document.getElementById('filter-year');
    if (yearInput) {
        yearInput.addEventListener("input", () => {
            const val = yearInput.value.trim();
            if (val === "" || val.length === 4) executeSearch();
        });
    }
    executeSearch(); 
});
