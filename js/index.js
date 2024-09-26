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
            console.log('Películas cargadas pero no mostradas:', moviesData);
        })
        .catch(error => console.error('Error en la petición:', error));
}

// Función para convertir el promedio de votos en estrellas
function renderStars(voteAverage) {
    const maxStars = 5;
    const rating = Math.round(voteAverage / 2); // convertir a una escala de 5 estrellas porque originalmente está hasta 10
    return '★'.repeat(rating) + '☆'.repeat(maxStars - rating);
}

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
        pelicula.genres.some(genero => genero.toLowerCase().includes(searchTerm)) || // Pasa el género a minúsculas y lo compara con lo ingresado
        (pelicula.tagline && pelicula.tagline.toLowerCase().includes(searchTerm)) || // Pasa la tagline a minúsculas y lo compara con lo ingresado
        (pelicula.overview && pelicula.overview.toLowerCase().includes(searchTerm)) // Pasa el overview a minúsculas y lo compara con lo ingresado
    );

    // Mostrar las películas filtradas
    filteredMovies.forEach(pelicula => { // Crea un li para cada película que coincida con los criterios de búsqueda
        const li = document.createElement('li'); // La constante li crea el elemento li
        li.innerHTML = `
            <h3>${pelicula.title}</h3>
            <p><em>${pelicula.tagline}</em></p>
            <p class="stars">${renderStars(pelicula.vote_average)}</p> 
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
