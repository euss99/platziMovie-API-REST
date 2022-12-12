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
const endpoint_DETAILS = "movie/";

// Utils -> Funciones que nos ayudan a reutilizar código

/* === Intersection observer para el lazy loading === */
// Creando una instancia del objeto IntersectionObserver que recibirá dos parámetros, una función (callback) y unas opciones IntersectionObserver(callback, options).
// La función dentro de la instancia recibe dos parámetros, (entries, observe) => {}, las entries son cada uno de los elememtos que estamos observando y los observe.
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // isIntersecting sirve para saber si el elemento esta dentro de la vista del navegador.
            const url = entry.target.getAttribute("data-img");
            entry.target.setAttribute("src", url);
        }
    })
});

function createMovies(movies, container, lazyLoad = false) {
    container.innerHTML = ""; // Borrando el contenido en cada petición para que no se duplique la información.

    movies.forEach(movie => {
        
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie-container");

        movieContainer.addEventListener("click", () => {
            location.hash = "#movie=" + movie.id;
        });

        const movieImg = document.createElement("img");
        movieImg.classList.add("movie-img");
        movieImg.setAttribute("alt", movie.title);
        // Concatenación de la URL base de las imágenes con un width de     300px
        movieImg.setAttribute(
            lazyLoad ? "data-img" : "src", 
            "https://image.tmdb.org/t/p/w300/" + movie.poster_path
        );

        if (lazyLoad) {
            lazyLoader.observe(movieImg);
        }

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

    createMovies(movies, trendingMoviesPreviewList, true);
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

// Función para ver los detalles de una película en específico
async function getMovieById(id) {
    // Renombrando a la variable data como movie, ya que este endpoint de la api ya nos devolvería un objeto con los datos de la película.
    const { data:movie } = await api(`${endpoint_DETAILS}${id}`);

    // Agregando la imágen del poster
    const movieImgURL = "https://image.tmdb.org/t/p/w300/" + movie.poster_path;
    console.log(movieImgURL);
    // Editando el CSS, para agregar el poster en el background:
    headerSection.style.background = `
    linear-gradient(
        180deg, 
        rgba(0, 0, 0, 0.35) 19.27%, 
        rgba(0, 0, 0, 0) 29.17%
        ),
    url(${movieImgURL})
    `;

    // Cargando la información de la api en los respectivos apartados del HTML.
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    // Agregando las categorias.s
    createCategories(movie.genres, movieDetailCategoriesList);

    getRelatedMoviesId(id);
}

// Función para ver las películas relacionadas dependiendo de la película.
async function getRelatedMoviesId(id) {
    const { data } = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer);
}