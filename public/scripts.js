// Agrega un evento que se ejecuta cuando el contenido del DOM ha sido completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const ListaPokemon = document.getElementById('lista');

    // Realiza una solicitud al servidor para obtener los datos de los Pokémon
    fetch(`${window.location.origin}/pokedex`)
    .then(response => response.json())
    .then(pokemonLista => {
        pokemonLista.forEach(pokemon => {
            // Separando las URLs de las imágenes
            const [gifUrl, pngUrl] = pokemon.imagen.split(',');
            
            // Crea una tarjeta para cada Pokémon y añade la interactividad
            const pokemonCard = document.createElement('div');
            pokemonCard.className = 'col-sm-6 col-md-4 col-lg-3 mb-4';

            // Asignar clase de borde según la generación
            let borderClass = `generacion-${pokemon.generacion}`;

            // Contenido HTML de la tarjeta, incluyendo imágenes y nombres
            pokemonCard.innerHTML = `
                <div class="${borderClass}" id="pokemon-card" data-bs-toggle="modal" data-bs-target="#pokemonModal">
                    <img src="${gifUrl}" onerror="this.src='${pngUrl}'" class="card-img-top" alt="${pokemon.nombre}">
                    <div class="card-body">
                        <h5 class="card-title d-none d-sm-block" >${pokemon.nombre}</h5>
                    </div>
                </div>
            `;

            // Añade un evento de clic a cada tarjeta para mostrar más detalles
            pokemonCard.addEventListener('click', function() {
                Actualizar(pokemon);
            });

            // Añade la tarjeta al contenedor principal
            document.getElementById('lista').appendChild(pokemonCard);

            // Añade el efecto de inclinacion a la tarjeta
            agregarEfectoInclinacion(pokemonCard);
            
        });
    })
    .catch(error => console.error('Error:', error));

    // Función para mostrar detalles de un Pokémon en un modal
    function Actualizar(pokemon) {

        // Separa los tipos para usar un estilo diferente en cada uno
        const tipos = pokemon.tipo.split(',').map(tipo => {
            const tipoClase = `tipo-${tipo.trim()}`;
            return `<span class="${tipoClase}">${tipo.trim()}</span>`;
        }).join(' ');

        // Separa las debilidades para usar un estilo diferente en cada uno
        const debilidades = pokemon.debilidades.split(',').map(debilidad => {
            const debilidadClase = `tipo-${debilidad.trim()}`;
                return `<span class="${debilidadClase}">${debilidad.trim()}</span>`;
        }).join(' ');

        const [gifUrl, pngUrl] = pokemon.imagen.split(',');

        // Actualiza el contenido del modal con los detalles del Pokémon seleccionado
        const modalBody = document.querySelector('#pokemonModal .modal-body');
        modalBody.innerHTML = `

            <div class="modal-header">
                <h5 class="modal-title" id="pokemonModalLabel">#${pokemon.numero_pokedex} ${pokemon.nombre}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="detalle-flex-container">
            <div class="detalle-imagen">
                <img src="${gifUrl}" onerror="this.src='${pngUrl}'" alt="${pokemon.nombre}">
            </div>
            <div class="detalle-info">
                <p>${pokemon.descripcion}</p>
                <p>Tipo: ${tipos}</p>
                <p>Debilidades: ${debilidades}</p>
                <p>Generacion: ${pokemon.generacion}</p>
                <div id="pokemonChart"></div>
            </div>
            </div>
        `;
        
        // Inicia el elemento de las graficas referenciando a un div y lo guarda en una variable 
        var myChart = echarts.init(document.getElementById('pokemonChart'));
        
        // Define las estadisticas de la grafica 
        var option = {
            tooltip: {},
            radar: {
                indicator: [
                    { name: 'CP Máximo', max: 6500 },
                    { name: 'HP Máximo', max: 500 },
                    { name: 'Ataque', max: 300 },
                    { name: 'Defensa', max: 250 },
                    { name: 'Stamina', max: 200 }
                ]
            },
            series: [{
                name: 'Estadísticas',
                type: 'radar',
                data: [{
                    value: [pokemon.max_cp, pokemon.max_hp, pokemon.ataque, pokemon.defensa, pokemon.stamina],
                    name: 'Estadísticas'
                }]
            }]
        };

        // Aplica las estadisticas de la grafica y las aplica al div de esta
        myChart.setOption(option);
        $('#pokemonModal').on('shown.bs.modal', function () {
            var myChart = echarts.init(document.getElementById('pokemonChart'));
            myChart.setOption(option);
        });
        
    }

});

//Funcion para buscar pokemon 
function BuscarPokemon() {
    var entrada = document.getElementById('buscador').value.toUpperCase();
    var lista = document.getElementById('lista');
    var tarjetas = lista.querySelectorAll('.col-sm-6.col-md-4.col-lg-3.mb-4');

    for (var i = 0; i < tarjetas.length; i++) {
        var titulo = tarjetas[i].querySelector('.card-title').textContent.toUpperCase();
        if (titulo.indexOf(entrada) > -1) {
            tarjetas[i].style.display = "";
        } else {
            tarjetas[i].style.display = "none";
        }
    }
}

//funcion que escucha del mouse y aplica la funcion de elevacion correspondiente al estado del mouse
function agregarEfectoInclinacion(card) {
    card.addEventListener('mousemove', tiltEffect);
    card.addEventListener('mouseleave', resetTiltEffect);
    card.addEventListener('mouseenter', startTiltEffect);
}

//Funcion aplicable cuando el mouse esta en la tarjeta
function tiltEffect(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const maxAngle = 15;
    const maxParallax = 15;

    const tiltX = (y / rect.height) * maxAngle * 2;
    const tiltY = (x / rect.width) * maxAngle * -2;
    
    const parallaxX = (x / rect.width) * maxParallax;
    const parallaxY = (y / rect.height) * maxParallax;

    this.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.08)`;
    this.querySelector('.card-img-top').style.transform = `translate(${parallaxX}px, ${parallaxY}px)`;
    this.querySelector('.card-title').style.transform = `translate(${parallaxX}px, ${parallaxY}px)`;

    this.style.transition = 'transform 0.1s ease-out';
}

//Funcion aplicable cuando el mouse sale de la tarjeta
function resetTiltEffect(e) {
    this.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    this.querySelector('.card-img-top').style.transform = 'translate(0, 0)';
}

//Funcion aplicable cuando el mouse entra en la tarjeta
function startTiltEffect(e) {
    this.style.transition = 'transform 0.1s ease-out';
}

//Limpiar contenedor de texto
document.getElementById('Limpiar').addEventListener('click', function() {
    document.getElementById('buscador').value = '';
    BuscarPokemon();
});

// Estado de grabación
let VozRec;
let grabando = false; 

// Función para cambiar el ícono del micrófono según el estado de grabación y el modo oscuro
function cambiarIconoMic(grabando) {
    var iconMic = document.getElementById('iconMic');
    var esModoOscuro = document.body.classList.contains('dark-mode');
    if (grabando) {
        iconMic.src = esModoOscuro ? './icons8-audio.gif' : './icons8-audio.gif';
    } else {
        iconMic.src = esModoOscuro ? 'https://img.icons8.com/color/40/microphone.png' : 'https://img.icons8.com/ios/40/microphone.png';
    }
}

if ('webkitSpeechRecognition' in window) {
    VozRec = new webkitSpeechRecognition();
    VozRec.lang = 'es-ES';
    VozRec.continuous = false;
    VozRec.interimResults = false;

    VozRec.onstart = function() {
        grabando = true;
        cambiarIconoMic(grabando);
    };

    VozRec.onresult = function(event) {
        let transcript = event.results[0][0].transcript;
        transcript = transcript.replace(".", '');
        document.getElementById('buscador').value = transcript;
        BuscarPokemon();
    };

    VozRec.onerror = function(event) {
        console.error('Error de reconocimiento de voz: ', event.error);
    };

    VozRec.onend = function() {
        grabando = false;
        cambiarIconoMic(grabando);
    };
}

document.getElementById('Mic').addEventListener('click', function() {
    if (!grabando) {
        VozRec.start();
    } else if (grabando) {
        VozRec.stop();
    }
});

//Función para el modo oscuro
document.getElementById('ModoOscuro').addEventListener('click', function() { 
    var body = document.body;
    var icon = document.getElementById('DMIcono');
    var iconMic = document.getElementById('iconMic');
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
        this.className = 'btn btn-light position-fixed top-0 end-0 m-3';
        cambiarIconoMic(grabando);
    } else {
        icon.className = 'fas fa-moon';
        this.className = 'btn btn-dark position-fixed top-0 end-0 m-3';
        cambiarIconoMic(grabando);
    }

    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

//Funcion para guardar el modo de color seleccionado ateriormente
document.addEventListener('DOMContentLoaded', function() {
    var icon = document.getElementById('DMIcono');
    var boton = document.getElementById('ModoOscuro');
    var iconMic = document.getElementById('iconMic');
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        icon.className = 'fas fa-sun';
        boton.className = 'btn btn-light position-fixed top-0 end-0 m-3';
        cambiarIconoMic(grabando);
    } else {
        icon.className = 'fas fa-moon';
        boton.className = 'btn btn-dark position-fixed top-0 end-0 m-3';
        cambiarIconoMic(grabando);
    }
});