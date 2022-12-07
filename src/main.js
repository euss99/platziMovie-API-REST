// API general 
const API = "https://api.themoviedb.org/3/";
const api_key = `api_key=` + API_KEY;
// API trending
const endpoint = "trending/movie/day";
const API_TRENDING = `${API}${endpoint}?${api_key}`;

// Función para conseguir las películas en tendencia para preview
async function getTrendingMoviesPreview() {
    const res = await fetch(API_TRENDING);
    const data = await res.json();

    const movies = data.results;
    movies.forEach(movie => {
        const trendingPreviewMoviesContainer = document.querySelector("#trendingPreview .trendingPreview-movieList");

        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie-container");

        const movieImg = document.createElement("img");
        movieImg.classList.add("movie-img");
        movieImg.setAttribute("alt", movie.title);
        // Concatenación de la URL base de las imágenes con un width de 300px
        movieImg.setAttribute(
            "src", 
            "https://image.tmdb.org/t/p/w300/" + movie.poster_path
        );

        movieContainer.appendChild(movieImg);
        trendingPreviewMoviesContainer.appendChild(movieContainer);
    });
}

getTrendingMoviesPreview();