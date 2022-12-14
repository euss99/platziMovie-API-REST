/* Utilizando Axios para las peticiones a la API */
// Data
const api = axios.create({
    baseURL: "https://api.themoviedb.org/3/", // Parte que nunca va a cambiar de la URL
    headers: {
        "Content-Type": "application/json;charset=utf-8",
    },
    params: {
        "api_key": API_KEY,
        "language": lang || navigator.language,
    }
});

// Local Storage
// Función para devolvernos el objeto de películas que se tengan guardadas en local storage.
function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem("liked_movies")); // Convirtiendo en objeto lo que venga en local storage.
    let movies;

    if (item) {
        movies = item;
    } else {
        movies = {};
    }

    return movies;
}

function likeMovie(movie) {
    const likedMovies = likedMoviesList();

    /* if ( movie está en localStorage ) {
        Removerla de LocalStorage
    } else {
        Agregarla a localStorage
    } */

    console.log(likedMovies);

    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined; // Eliminando la propiedad de la pelicula en el objeto.
    } else {
        likedMovies[movie.id] = movie;
    }

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies)); // Agregando al local storage y convirtiendo el contenido a un string.

    // Actualizando la página para agregar la película a favoritos.
    if (location.hash == ''){
        getLikedMovies();
        getTrendingMoviesPreview(); 
    }
}

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

function createMovies(
    movies, 
    container, 
    // Utilizanod un objeto para agrupar un parámetro booleano
    {
        lazyLoad = false, 
        clean = true,
    } = {},
    ) {
    if (clean) {
        container.innerHTML = ""; // Borrando el contenido en cada petición para que no se duplique la información.
    }

    movies.forEach(movie => {
        
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie-container");

        const movieImg = document.createElement("img");
        movieImg.classList.add("movie-img");
        movieImg.setAttribute("alt", movie.title);
        movieImg.addEventListener("click", () => {
            location.hash = "#movie=" + movie.id;
        });
        // Concatenación de la URL base de las imágenes con un width de 300px
        movieImg.setAttribute(
            lazyLoad ? "data-img" : "src", 
            "https://image.tmdb.org/t/p/w300/" + movie.poster_path
        );
        // Creando un evento de error, en dado caso de que no se encuentre una imágen.
        movieImg.addEventListener("error", () => {
            movieImg.setAttribute(
                "src",
                "https://static.platzi.com/static/images/error/img404.png"
            );
        });

        // Creando el botón de like
        const movieBtn = document.createElement("button");
        movieBtn.classList.add("movie-btn");

        // Las películas que se agregan en la sección de favoritas agregarle la clase "movie-btn--liked".
        if (likedMoviesList()[movie.id]) {
            movieBtn.classList.add('movie-btn--liked');
        }

        movieBtn.addEventListener("click", () => {
            // Cambio de clase al momento de darle click al boton
            movieBtn.classList.toggle("movie-btn--liked")

            // Agregar la película a local storge (Películas favoritas)
            likeMovie(movie);
        })
            
        if (lazyLoad) {
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
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

/* === Llamados a la API === */
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
        movie: {
            with_genres: id,
        },
    });

    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(movies, genericSection, { lazyLoad: true });
}

function getPaginatedMoviesByCategory(id) {
    return async function () {
        const {
            scrollTop, // Cuanto scroll se ha hecho, de solo lo que se esta viendo.
            clientHeight, // Alto de la pantalla.
            scrollHeight, // Scroll total que se puede hacer.
        } = document.documentElement;
    
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;
    
        if (scrollIsBottom && pageIsNotMax) {
            page++;
    
            const {data} = await api(endpoint_DISCOVER, {
                // Especificando query parameters
                params: {
                    with_genres: id,
                    page,
                },
            });
        
            const movies = data.results;

            createMovies(movies, 
                genericSection, 
                { lazyLoad: true, clean: false}
            );
        }
    }
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
    maxPage = data.total_pages;

    createMovies(movies, genericSection);
}

function getPaginatedMoviesBySearch(query) {
    return async function () {
        const {
            scrollTop, // Cuanto scroll se ha hecho, de solo lo que se esta viendo.
            clientHeight, // Alto de la pantalla.
            scrollHeight, // Scroll total que se puede hacer.
        } = document.documentElement;
    
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;
    
        if (scrollIsBottom && pageIsNotMax) {
            page++;
    
            const {data} = await api(endpoint_SEARCH, {
                params: {
                    query,
                    page,
                },
            });
        
            const movies = data.results;
        
            createMovies(movies, 
                genericSection, 
                { lazyLoad: true, clean: false}
            );
        }
    }
}

// Función para ver los trending de las películas (endpoint_TRENDING)
async function getTrendingMovies() {
    const {data} = await api(endpoint_TRENDING);
    const movies = data.results;
    // Obteniendo el total de páginas.
    maxPage = data.total_pages;

    createMovies(movies, 
        genericSection, 
        { lazyLoad: true, clean: true}
    );
}

// Función para cargar las diferentes páginas de películas.
async function getPaginatedTrendinMovies() {
    const {
        scrollTop, // Cuanto scroll se ha hecho, de solo lo que se esta viendo.
        clientHeight, // Alto de la pantalla.
        scrollHeight, // Scroll total que se puede hacer.
    } = document.documentElement;

    // Validación para saber si el scrollTop más el clientHeight son mayores o iguales al scrollHeight.
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    // Valiando que no sea la última página
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
        page++; // Cada vez que se realice la función se sumamará una pagina.

        const {data} = await api(endpoint_TRENDING, {
            // Agregando un query parameter, para mostrar la paginación
            params: {
                page,
            },
        });
        const movies = data.results;
    
        createMovies(movies, 
            genericSection, 
            { lazyLoad: true, clean: false}
        );
    }
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

// Función para consumir el local storage y agregar las películas favoritas en su sección.
function getLikedMovies() {
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies);
  
    createMovies(moviesArray, likedMoviesListContainer, { lazyLoad: true, clean: true });

    console.log(likedMovies);
}
