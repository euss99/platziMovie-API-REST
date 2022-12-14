let maxPage;
let page = 1;
let infiniteScroll;
// let lang = 'en';

searchFormBtn.addEventListener("click", () => {
    location.hash = "#search=" + searchFormInput.value;
});

trendingBtn.addEventListener("click", () => {
    location.hash = "#trends"
});

arrowBtn.addEventListener("click", () => {
    location.hash = window.history.back(); // Para regresar a la busqueda anterior.
});

// selectLenguage.addEventListener('change', () => {
//     lang = selectLenguage.value;
//     console.log(lang);
//     homePage();
// });

// LLamando a la función Navigator al momento de que cargue la aplicación (la primera carga).
window.addEventListener("DOMContentLoaded", Navigator, false);
// Llamando a la función Navigator cada que cambie el hash (hashchange).
window.addEventListener("hashchange", Navigator, false);
// Llamando al evento de scroll para activar la función.
window.addEventListener("scroll", infiniteScroll, false);

function Navigator() {
    console.log({ location });

    if (infiniteScroll) {
        window.removeEventListener("scroll", infiniteScroll, {passive: false});
        infiniteScroll = undefined;
    }

    if (location.hash.startsWith("#trends")) {
        // Si location.hash empieza en la sección de trends
        trendsPage();
    } else if (location.hash.startsWith("#search=")) {
        // Si location.hash empieza en la sección de serch (busqueda)
        searchPage();
    } else if (location.hash.startsWith("#movie=")) {
        // Si location.hash empieza en la sección de los detalles de una película
        movieDetailsPage();
    } else if (location.hash.startsWith("#category=")) {
        // Si location.hash empieza en la sección de categorias
        categoriesPage();
    } else {
        // Si ninguno funciona entrar al home
        homePage();
    }

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0; // Manera de que siempre que entremos a otra página, aparezca en la parte de ariba (con esas dos líneas).

    if (infiniteScroll) {
        window.addEventListener("scroll", infiniteScroll, {passive: false});
    }
}

function homePage() {
    console.log("HOME");

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.add("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    headerTitle.classList.remove("inactive");
    headerCategoryTitle.classList.add("inactive");
    searchForm.classList.remove("inactive");

    trendingPreviewSection.classList.remove("inactive");
    categoriesPreviewSection.classList.remove("inactive");
    likedMoviesSection.classList.remove("inactive");
    genericSection.classList.add("inactive");
    movieDetailSection.classList.add("inactive");

    // Funciones que van a cargar cuando estemos en el hash "home"
    getTrendingMoviesPreview();
    getCategoriesPreview();
}

function categoriesPage() {
    console.log("CATEGORIES");

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    headerTitle.classList.add("inactive");
    headerCategoryTitle.classList.remove("inactive");
    searchForm.classList.add("inactive");

    trendingPreviewSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    likedMoviesSection.classList.add("inactive");
    genericSection.classList.remove("inactive");
    movieDetailSection.classList.add("inactive");

    // Creando un array con el método split, en este caso crearía un elemento dentro del array cada que se encuentre con "="
    const [ , categoryData] = location.hash.split("=") // ["#category", "id-name"]
    // Separando categoryData
    const [categoryId, categoryName] = categoryData.split("-") // ["id", "name"]

    
    // const newName = categoryName.replace("%20", " ");
    const newName = decodeURI(categoryName);
    headerCategoryTitle.innerHTML = newName;
    getMoviesByCategory(categoryId);

    infiniteScroll = getPaginatedMoviesByCategory(categoryId);
}

function movieDetailsPage() {
    console.log("MOVIES");

    headerSection.classList.add("header-container--long");
    // headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.add("header-arrow--white");
    headerTitle.classList.add("inactive");
    headerCategoryTitle.classList.add("inactive");
    searchForm.classList.add("inactive");

    trendingPreviewSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    likedMoviesSection.classList.add("inactive");
    genericSection.classList.add("inactive");
    movieDetailSection.classList.remove("inactive");

    const [ , movieId] = location.hash.split("=") // ["#movie", "id"]
    getMovieById(movieId);
}

function searchPage() {
    console.log("SERCH");

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    headerTitle.classList.add("inactive");
    headerCategoryTitle.classList.add("inactive");
    searchForm.classList.remove("inactive");

    trendingPreviewSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    likedMoviesSection.classList.add("inactive");
    genericSection.classList.remove("inactive");
    movieDetailSection.classList.add("inactive");

    const [ , query] = location.hash.split("=") // ["#search", "buscado"]
    getMoviesBySearch(query);

    infiniteScroll = getPaginatedMoviesBySearch(query);
}

function trendsPage() {
    console.log("TRENDS");

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    headerTitle.classList.add("inactive");
    headerCategoryTitle.classList.remove("inactive");
    searchForm.classList.add("inactive");

    trendingPreviewSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    likedMoviesSection.classList.add("inactive");
    genericSection.classList.remove("inactive");
    movieDetailSection.classList.add("inactive");

    headerCategoryTitle.innerHTML = "Tendencias";

    getTrendingMovies();

    infiniteScroll = getPaginatedTrendinMovies;
}