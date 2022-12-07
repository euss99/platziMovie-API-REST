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
const endpoint_GENRE = "/genre/movie/list"

// Función para conseguir las películas en tendencia para preview
async function getTrendingMoviesPreview() {
    const {data} = await api(endpoint_TRENDING);
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
    const {data} = await api(endpoint_GENRE);
    const categorias = data.genres;

    const previewCategoriesContainer = document.querySelector("#categoriesPreview .categoriesPreview-list");
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