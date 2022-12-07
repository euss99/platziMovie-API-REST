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

    // Funciones que van a cargar cuando estemos en el hash "home"
    getTrendingMoviesPreview();
    getCategoriesPreview();
}

function categoriesPage() {
    console.log("CATEGORIES");
}

function movieDetailsPage() {
    console.log("MOVIES");
}

function searchPage() {
    console.log("SERCH");
}

function trendsPage() {
    console.log("TRENDS");
}