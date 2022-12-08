searchFormBtn.addEventListener("click", () => {
    location.hash = "#search=" + searchFormInput.value;
});

trendingBtn.addEventListener("click", () => {
    location.hash = "#trends"
});

arrowBtn.addEventListener("click", () => {
    location.hash = window.history.back(); // Para regresar a la busqueda anterior.
});

// LLamando a la función navigator al momento de que cargue la aplicación (la primera carga).
window.addEventListener("DOMContentLoaded", navigator, false)
// Llamando a la función navigator cada que cambie el hash (hashchange).
window.addEventListener("hashchange", navigator, false)

function navigator() {
    console.log({ location });

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
    genericSection.classList.add("inactive");
    movieDetailSection.classList.remove("inactive");
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
    genericSection.classList.remove("inactive");
    movieDetailSection.classList.add("inactive");

    const [ , query] = location.hash.split("=") // ["#search", "buscado"]
    getMoviesBySearch(query);
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
    genericSection.classList.remove("inactive");
    movieDetailSection.classList.add("inactive");
}