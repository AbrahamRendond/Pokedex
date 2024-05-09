document.addEventListener('DOMContentLoaded', function() {
    const ListaPokemon = document.getElementById('lista');

    fetch('http://localhost:3000/pokedex')
    .then(response => response.json())
    .then(pokemonLista => {
        pokemonLista.forEach(pokemon => {
            // Separando las URLs de las imágenes
            const [gifUrl, pngUrl] = pokemon.imagen.split(',');

            const pokemonCard = document.createElement('div');
            pokemonCard.className = 'col-sm-6 col-md-4 col-lg-3 mb-4';

            // Asignar clase de borde según la generación
            let borderClass = `generacion-${pokemon.generacion}`;
            pokemonCard.innerHTML = `
                <div class="${borderClass}" id="pokemon-card" data-bs-toggle="modal" data-bs-target="#pokemonModal">
                    <img src="${gifUrl}" onerror="this.src='${pngUrl}'" class="card-img-top" alt="${pokemon.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${pokemon.nombre}</h5>
                    </div>
                </div>
            `;
            pokemonCard.addEventListener('click', function() {
                Actualizar(pokemon);
            });
            document.getElementById('lista').appendChild(pokemonCard);
        });
    })
    .catch(error => console.error('Error:', error));

    function Actualizar(pokemon) {

        const tipos = pokemon.tipo.split(',').map(tipo => {
            const tipoClase = `tipo-${tipo.trim()}`;
            return `<span class="${tipoClase}">${tipo.trim()}</span>`;
        }).join(' ');
        const debilidades = pokemon.debilidades.split(',').map(debilidad => {
            const debilidadClase = `tipo-${debilidad.trim()}`;
                return `<span class="${debilidadClase}">${debilidad.trim()}</span>`;
        }).join(' ');

        const [gifUrl, pngUrl] = pokemon.imagen.split(',');
        const modalBody = document.querySelector('#pokemonModal .modal-body');
        modalBody.innerHTML = `
            <div class="detalle-flex-container">
            <div class="detalle-imagen">
                <img src="${gifUrl}" onerror="this.src='${pngUrl}'" alt="${pokemon.nombre}">
            </div>
            <div class="detalle-info">
                <p>${pokemon.descripcion}</p>
                <p>Tipo: ${tipos}</p>
                <p>Debilidades: ${debilidades}</p>
                <p>Generacion: ${pokemon.generacion}</p>
                <div id="pokemonChart" style="height: 400px;"></div>
            </div>
            </div>
        `;

        var myChart = echarts.init(document.getElementById('pokemonChart'));
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
        myChart.setOption(option);
        $('#pokemonModal').on('shown.bs.modal', function () {
            var myChart = echarts.init(document.getElementById('pokemonChart'));
            myChart.setOption(option);
        });
        
    }

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', tiltEffect);
        card.addEventListener('mouseleave', resetTiltEffect);
    });

});

//Funcion para buscar pokemon 
function BuscarPokemon() {
    var entrada = document.getElementById('buscador').value.toUpperCase();
    var lista = document.getElementById('lista');
    var tarjetas = lista.querySelectorAll('.col-sm-6.col-md-4.col-lg-3.mb-4'); // Asegúrate de que este selector sea correcto

    for (var i = 0; i < tarjetas.length; i++) {
        var titulo = tarjetas[i].querySelector('.card-title').textContent.toUpperCase();
        if (titulo.indexOf(entrada) > -1) {
            tarjetas[i].style.display = "";
        } else {
            tarjetas[i].style.display = "none";
        }
    }
}

//Funcion para efecto de carta
function tiltEffect(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    const rotateX = mouseY / rect.height * 10; // Máximo 10 grados de rotación en X
    const rotateY = mouseX / rect.width * -10; // Máximo 10 grados de rotación en Y

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function resetTiltEffect(e) {
    const card = e.currentTarget;
    card.style.transform = 'rotateX(0) rotateY(0)';
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
    } else {
        VozRec.stop();
    }
});

// Código para el modo oscuro
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