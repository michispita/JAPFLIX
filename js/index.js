const url = 'https://japceibal.github.io/japflix_api/movies-data.json'; //defino el json
let moviesData = []; //creo una lista para almacenar la información
const searchbtn = document.getElementById('btnBuscar'); //defino el botón de búsqueda

// Función para fetchear la url de la constante
function dataMovies() {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición');
            }
            return response.json();
        })
        .then(data => {
            moviesData = data;  // Guardar la información en la variable
            console.log('Datos de películas cargados:', moviesData); // Verificar que los datos se cargan correctamente
        })
        .catch(error => console.error('Error en la petición:', error));
}

// Función para convertir la puntuación en estrellas
function renderStars(voteAverage) {
    const maxStars = 5;
    const rating = Math.round(voteAverage / 2); // Convertir la puntuación de 10 a 5 estrellas
    let starsHTML = '';

    // Agregar las estrellas llenas
    for (let i = 1; i <= rating; i++) {
        starsHTML += '<span class="fa fa-star checked"></span>';
    }

    // Agregar estrellas vacías
    for (let i = 0; i < (maxStars - rating); i++) {
        starsHTML += '<span class="fa fa-star"></span>';
    }

    return starsHTML;
}

console.log(renderStars(10));

// Función para buscar y mostrar las películas
function buscarPeliculas() {
    const searchTerm = document.getElementById('inputBuscar').value.toLowerCase(); // valor ingresado (en minúsculas) por el usuario 

    const moviesList = document.getElementById('lista'); 
    moviesList.innerHTML = ''; // Limpiar la lista de resultados

    if (moviesData.length === 0) {
        moviesList.innerHTML = '<li>No hay datos de películas disponibles.</li>';
        return;
    }

    // Filtrar las películas que coincidan con el término de búsqueda
    const filteredMovies = moviesData.filter(pelicula =>  // Filtra en la constante donde está la info
        pelicula.title.toLowerCase().includes(searchTerm) ||  // Pasa el título a minúsculas y lo compara con lo ingresado
        pelicula.genres.some(genero => genero.name.toLowerCase().includes(searchTerm)) || // Pasa el género a minúsculas y lo compara con lo ingresado
        (pelicula.tagline && pelicula.tagline.toLowerCase().includes(searchTerm)) || // Pasa la tagline a minúsculas y lo compara con lo ingresado
        (pelicula.overview && pelicula.overview.toLowerCase().includes(searchTerm)) // Pasa el overview a minúsculas y lo compara con lo ingresado
    );

    console.log('Películas filtradas:', filteredMovies);

    // Mostrar las películas filtradas
    filteredMovies.forEach(pelicula => { // Crea un li para cada película que coincida con los criterios de búsqueda
        const li = document.createElement('li'); // La constante li crea el elemento li
        li.innerHTML = `
            <div class="movie-header">
            <h3 class=movie-title>${pelicula.title}</h3> 
            <p class="stars">${renderStars(pelicula.vote_average)}</p> 
            </div>
            <p class=movie-tagline><em>${pelicula.tagline}</em></p>
        `; // La información deseada se agrega al li
        moviesList.appendChild(li); // Se agrega el li al campo de moviesList
    });

    // Si no hay coincidencias, mostrar un mensaje
    if (filteredMovies.length === 0) {
        moviesList.innerHTML = '<li>No se encontraron películas que coincidan con la búsqueda.</li>';
    }
}

// Ejecuta la función de carga de datos cuando la página se haya cargado
document.addEventListener('DOMContentLoaded', dataMovies);

// Realiza la búsqueda cuando el usuario presione el botón
searchbtn.addEventListener('click', buscarPeliculas);  
