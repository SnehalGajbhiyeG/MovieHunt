// https://www.omdbapi.com/?s=avenger&page=1&apikey=86fc1ff7
// https://www.omdbapi.com/?i=tt3896198&apikey=86fc1ff7

const API_KEY = '86fc1ff7'

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// load movies from API 
async function loadMovies(searchTerm) {
    const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=` + API_KEY;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.search); 
    // Response functionality given in api i.e True or false
    if (data.Response == 'True') displayMovieList(data.Search);
}

function findMovies() {
    let searchTerm = (movieSearchBox.value).trim();
    // console.log(searchTerm);  

    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies) {
    searchList.innerHTML = "";
    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add('search-list-item');
        if (movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else
            moviePoster = 'image_not_found.png';

        movieListItem.innerHTML = `
         <div class="search-item-thumbnail">
                     <img src="${moviePoster}" alt="">
         </div>
         <div class="search-item-info">
                 <h3>${movies[idx].Title}</h3>
                <p>${movies[idx].Year}</p>
         </div>
        `; 

        searchList.appendChild(movieListItem)
    } 
    loadMovieDetails(); 
} 

function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item'); 
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id)
            searchList.classList.add('hide-search-list'); 
            movieSearchBox.value = ""; 
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=86fc1ff7`); 
            const movieDetails = await result.json(); 
            // console.log(movieDetails); 
            displayMovieDetails(movieDetails); 
        }); 
    }); 
}

function displayMovieDetails(details) {
    resultGrid.innerHTML = `
     <div class="movie-poster">
                        <img src="${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt="movie poster">
                    </div>
                    <div class="movie-info">
                        <h3 class="movie-title">${details.Title}</h3>
                        <ul class="movie-misc-info">
                            <li class="year">${details.Year}</li>
                            <li class="rated">${details.Rated}</li>
                            <li class="released">${details.Released}  </li>

                        </ul>

                        <p class="genre"><b>Genre:</b>${details.Genre}</p>
                        <p class="writer"><b>Writer:</b>${details.Writer}</p>
                        <p class="actors"><b>Actors:</b>${details.Actors}</p>
                        <p class="plot"><b>Plot:</b>${details.Plot}</p>
                        <p class="language"><b>Language:</b>${details.Language}</p>
                        <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
                    </div>
    `;
}

window.addEventListener('click', (event) => {
    if(event.target.className != 'form-control') {
        searchList.classList.add('hide-search-list'); 
    }
});