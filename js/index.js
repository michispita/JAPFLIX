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

    filteredMovies.forEach((pelicula, index) => { // El index se usará para IDs únicos
        const li = document.createElement('li'); 
    
        // Obtener los géneros como una lista de nombres
        const generos = pelicula.genres.map(genero => genero.name).join(', '); 
        const anioLanzamiento = pelicula.release_date.substring(0, 4); 
    
        li.innerHTML = `
            <div class="movie-header">
                <h3 class="movie-title">${pelicula.title}</h3> 
                <p class="stars">${renderStars(pelicula.vote_average)}</p> 
            </div>
            <p class="movie-tagline"><em>${pelicula.tagline}</em></p>
            
            <button class="btn btn-primary" id="btn-info" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop-${index}" aria-controls="offcanvasTop-${index}">
                More info
            </button>
        `;
    
        moviesList.appendChild(li);
    
        // Crear el offcanvas fuera del `li` y añadirlo al body
        const offcanvasDiv = document.createElement('div');
        offcanvasDiv.innerHTML = `
            <div class="offcanvas offcanvas-top" tabindex="-1" id="offcanvasTop-${index}" aria-labelledby="offcanvasTopLabel-${index}">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="offcanvasTopLabel-${index}">Information</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <h4 class="offc-title">${pelicula.title.toUpperCase()}</h4>
                    <p>${pelicula.overview}</p>
                    <p><strong>Genres:</strong> ${generos}</p>
                </div>
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        More
                    </button>
                    <ul class="dropdown-menu">
                        <p class="dropdown-item">Year: ${anioLanzamiento}</p>
                        <p class="dropdown-item">Runtime: ${pelicula.runtime} mins</p>
                        <p class="dropdown-item">Budget: $${pelicula.budget}</p>
                        <p class="dropdown-item">Revenue: $${pelicula.revenue}</p>
                    </ul>
                </div>
            </div>
        `;
    
        document.body.appendChild(offcanvasDiv); // Añadir el offcanvas al body, fuera del contenedor de la película
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
