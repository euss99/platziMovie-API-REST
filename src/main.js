/* Utilizando Axios para las peticiones a la API */
const api = axios.create({
    baseURL: "https://api.themoviedb.org/3/", // Parte que nunca va a cambiar de la URL
    headers: {
        "Content-Type": "application/json;charset=utf-8",
    },
    params: {
        "api_key": API_KEY,
    }
});
const endpoint_TRENDING = "trending/movie/day";
const endpoint_GENRE = "genre/movie/list";
const endpoint_DISCOVER = "discover/movie";
const endpoint_SEARCH = "search/movie";

// Utils -> Funciones que nos ayudan a reutilizar código
function createMovies(movies, container) {
    container.innerHTML = ""; // Borrando el contenido en cada petición para que no se duplique la información.

    movies.forEach(movie => {
        
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie-container");

        const movieImg = document.createElement("img");
        movieImg.classList.add("movie-img");
        movieImg.setAttribute("alt", movie.title);
        // Concatenación de la URL base de las imágenes con un width de     300px
        movieImg.setAttribute(
            "src", 
            "https://image.tmdb.org/t/p/w300/" + movie.poster_path
        );

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    });
}

function createCategories(categories, container) {
    container.innerHTML = "";

    categories.forEach(category => {
        const categoryContainer = document.createElement("div");
        categoryContainer.classList.add("category-container");

        const categoryTitle = document.createElement("h3");
        categoryTitle.classList.add("category-title");
        categoryTitle.setAttribute("id", "id" + category.id);
        categoryTitle.addEventListener("click", () => {
            location.hash = `#category=${category.id}-${category.name}`;
        })
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}

/* Llamados a la API */
// Función para conseguir las películas en tendencia para preview (HOME)
async function getTrendingMoviesPreview() {
    const {data} = await api(endpoint_TRENDING);
    const movies = data.results;

    createMovies(movies, trendingMoviesPreviewList);
}

// Función para ver las categorias de las películas para preview (HOME)
async function getCategoriesPreview() {
    const {data} = await api(endpoint_GENRE);
    const categories = data.genres;

    createCategories(categories, categoriesPreviewList);
}

// Función para ver las categorias de las películas (CATEGORIES)
async function getMoviesByCategory(id) {
    const {data} = await api(endpoint_DISCOVER, {
        // Especificando query parameters
        params: {
            with_genres: id,
        },
    });

    const movies = data.results;

    createMovies(movies, genericSection);
}

// Función para ver las busquedas de las películas para preview (SEARCH)
async function getMoviesBySearch(query) {
    const {data} = await api(endpoint_SEARCH, {
        // Especificando query parameters
        params: {
            query,
        },
    });

    const movies = data.results;
    createMovies(movies, genericSection);
}

// Función para ver los trending de las películas (endpoint_TRENDING)
async function getTrendingMovies() {
    const {data} = await api(endpoint_TRENDING);
    const movies = data.results;

    createMovies(movies, genericSection);
}