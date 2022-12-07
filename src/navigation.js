searchFormBtn.addEventListener("click", () => {
    location.hash = "#search="
});

trendingBtn.addEventListener("click", () => {
    location.hash = "#trends"
});

arrowBtn.addEventListener("click", () => {
    location.hash = "#home"
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
    headerCategoryTitle.classList.remove("inactive");
    searchForm.classList.remove("inactive");

    trendingPreviewSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    genericSection.classList.remove("inactive");
    movieDetailSection.classList.add("inactive");
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