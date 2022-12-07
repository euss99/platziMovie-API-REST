// API general 
const API = "https://api.themoviedb.org/3/";
const api_key = `api_key=` + API_KEY;
// API trending
const endpoint_TRENDING = "trending/movie/day";
const API_TRENDING = `${API}${endpoint_TRENDING}?${api_key}`;
// API genres
const endpoint_GENRE = "/genre/movie/list"
const API_GENRE = `${API}${endpoint_GENRE}?${api_key}`;

// Función para conseguir las películas en tendencia para preview
async function getTrendingMoviesPreview() {
    const res = await fetch(API_TRENDING);
    const data = await res.json();

    const movies = data.results;

    const trendingPreviewMoviesContainer = document.querySelector("#trendingPreview .trendingPreview-movieList");
    movies.forEach(movie => {
        
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

// Función para ver las categorias de las películas
async function getCategoriesPreview() {
    const res = await fetch(API_GENRE);
    const data = await res.json();

    const categorias = data.genres;

    const previewCategoriesContainer = document.querySelector("#categoriesPreview .categoriesPreview-list")
    categorias.forEach(category => {
        const categoryContainer = document.createElement("div");
        categoryContainer.classList.add("category-container");

        const categoryTitle = document.createElement("h3");
        categoryTitle.classList.add("category-title");
        categoryTitle.setAttribute("id", "id" + category.id);
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        previewCategoriesContainer.appendChild(categoryContainer);
    })
}

getTrendingMoviesPreview();
getCategoriesPreview();