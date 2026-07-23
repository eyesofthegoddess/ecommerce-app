// data requests http://www.omdbapi.com/?apikey=[7d6c7720]&
// posters request http://img.omdbapi.com/?apikey=[7d6c7720]&
// random movie api https://api.example.com/random-movie 

const apiKey = '7d6c7720'; // Your API key
const searchButton = document.getElementById('searchBtn');
const searchInput = document.getElementById('search');
const resultsContainer = document.getElementById('results');

searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
        const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
        const data = await response.json();

        // Clear previous results
        resultsContainer.innerHTML = '';

        // Check if the response is valid
        if (data.Response === 'True') {
            data.Search.forEach(movie => {
                const movieElement = document.createElement('div');
                movieElement.innerHTML = `<h3>${movie.Title} (${movie.Year})</h3><img src="${movie.Poster}" alt="${movie.Title} poster">`;
                resultsContainer.appendChild(movieElement);
            });
        } else {
            resultsContainer.innerHTML = `<p>${data.Error}</p>`;
        }
    }
});

//* contact event set up with my emailjs*//
function contact(event) {
  event.preventDefault();
  const loading = document.querySelector(".modal__overlay--loading");
  const success = document.querySelector(".modal__overlay--success");
  loading.classList += " modal__overlay--visible";
  emailjs
    .sendForm(
      `service_4zynz44`,
      `template_iku491j`,
      event.target,
      `ZZNd8hGqexXDYyFy2`
    ).then(() => {
      loading.classList.remove("modal__overlay--visible");
      success.classList += " modal__overlay--visible";
    })
    .catch(() => {
      loading.classList.remove("modal__overlay--visible");
      alert(
        "The email service is temporarily unavailable. Please contact me directly at eyesofthegoddess@hotmail.com"
      );
    });
}