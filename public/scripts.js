document.addEventListener('DOMContentLoaded', function() {
    const ListaPokemon = document.getElementById('lista');
    const DetallesPokemon = document.getElementById('detalles');

    fetch('http://localhost:3000/pokedex')
        .then(response => response.json())
        .then(pokemonLista => {
                    pokemonLista.forEach(pokemon => {
                        const pokemonIcono = document.createElement('div');
                        const imagen = pokemon.imagen.substring(0,pokemon.imagen.indexOf(','));
                        const imagenalt = pokemon.imagen.substring(pokemon.imagen.indexOf(',')+1,pokemon.imagen.length);
                        pokemonIcono.classList.add('pokemon-card', `generacion-${pokemon.generacion}`);
                        pokemonIcono.innerHTML = `
                            <h2>${pokemon.nombre}</h2>
                            <img src=${imagen} alt=${pokemon.nombre} onerror="this.onerror=null; this.src='${imagenalt}'; this.classList.add('imagen-alt');" />
                        `;
                        pokemonIcono.onclick = function(event) {
                            event.stopPropagation();
                            Actualizar(pokemon);
                        };
                        ListaPokemon.appendChild(pokemonIcono);
                    });
                })
        .catch(error => console.error('Error:', error));

    function Actualizar(pokemon) {

        const detallesPokemon = document.getElementById('detalles');

        const tipos = pokemon.tipo.split(',').map(tipo => {
            const tipoClase = `tipo-${tipo.trim()}`;
            return `<span class="${tipoClase}">${tipo.trim()}</span>`;
        }).join(', ');
        const debilidades = pokemon.debilidades.split(',').map(debilidad => {
            const debilidadClase = `tipo-${debilidad.trim()}`;
                return `<span class="${debilidadClase}">${debilidad.trim()}</span>`;
        }).join(', ');
        
        const imagen = pokemon.imagen.substring(0,pokemon.imagen.indexOf(','));
        const imagenalt = pokemon.imagen.substring(pokemon.imagen.indexOf(',')+1,pokemon.imagen.length);
        
        DetallesPokemon.innerHTML = `

        <div class="detalle-flex-container">
        <div class="detalle-imagen">
            <img src=${imagen} alt=${pokemon.nombre} onerror="this.onerror=null; this.src='${imagenalt}'; this.classList.add('imagen-alt');" />
        </div>
        <div class="detalle-info">
            <h3>${pokemon.nombre} (#${pokemon.numero_pokedex})</h3>
            <img id="close" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB/ElEQVR4nO2au0oDQRSGP7RYAxYiirWgD6CgW1gqqKAvoT6E8QVyKYyl2mujhb6AsdBeREyRShAEi4hiY4wXFiJITLJnZ2dmxyU/TLfznznLtztnzyz01JNVlYGvLuMJ8A3E9Zve3WIHaxPrKsQsGFVgUGMSgVdVEDdYm1jTQF1guqcxkX1BvAYwG9U4LzAOxqqGJJaAT0GsnIq5B9wIzB+BsRhJjAIPgjgVYCDOw9cQBDmNkcixwP8DmCOmpIitK3hvCL1zaJAUsVdgMoLvOPBiGilVxC6BfsLVB5zbQkoVsSzh2rKJlCpi78AMnTUFvNlGShWxWyDT4WZcJ4VUqwpCLEp/ZsKOcG4eC5IiFuzUy7/mLQh374pJpFQRuweGgSHgzhWkVBE7bA7JtQUSkBQx6bCKlCpiTiKliljibynTiCWKlC7EnEBKB2JOINWqokIiibxuU4+Wp+Fhb1dg/guknEPMT8OG6BkoUTIuI3XgctHop6GM9yJ8WAWt0B/NNxfqDGJFISbbbeaWXEHMT0PzwRMiVdfYDsokWRRuCryySRWVvhCpC5dbpl6EJvZExCb2s03ECkIM1hS8120h5guROokR48g0Yp6lo7eRCEdvGZNIrRBfi8J2at4UUrvoU3DUrR2x1PwwUA4xqxn8haMWEvvMQNyeeqKDvgGmxjw+5jmxEQAAAABJRU5ErkJggg==">
            <p>${pokemon.descripcion}</p>
            <p>Tipo: ${tipos}</p>
            <div id="pokemonChart"></div>
            <p>Debilidades: ${debilidades}</p>
            <p>Generacion: ${pokemon.generacion}</p>
        </div>
        </div>
         
        `;

        DetallesPokemon.style.display = "block";

        document.querySelectorAll('.pokemon-card').forEach(card => {
            card.addEventListener('mousemove', tiltEffect);
            card.addEventListener('mouseleave', resetTiltEffect);
            card.addEventListener('mouseenter', startTiltEffect);
        });

        var myChart = echarts.init(document.getElementById('pokemonChart'));
        var option = {
            tooltip: {},
            grid: {
                containLabel: true,
                left: '10%',
                right: '10%',
                bottom: '10%',
                top: '10%'
            },
            radar: {
                name: {
                    textStyle: {
                        color: '#fff',
                        backgroundColor: '#999',
                        borderRadius: 3,
                        padding: [3, 5]
                    }
                },
                indicator: [
                    { name: 'CP Máximo', max: 6500},
                    { name: 'HP Máximo', max: 500},
                    { name: 'Ataque', max: 300},
                    { name: 'Defensa', max: 250},
                    { name: 'Stamina', max: 200}
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

    }

});

//Boton de cerrar detalles
document.addEventListener("click", function(e){
    const detalles = document.getElementById('detalles');
    const close= document.getElementById('close')
    if (!detalles.contains(e.target) || close.contains(e.target) && detalles.style.display !== "none") {
        detalles.style.display = "none";
    }
});

document.addEventListener('keydown', function(e) {
    const detalles = document.getElementById('detalles');
    const close= document.getElementById('close')
    if (e.key === "Escape" && detalles.style.display !== "none") {
        detalles.style.display = "none";
    }
});

//Funcion para buscar pokemon 
function BuscarPokemon() {
    var entrada = document.getElementById('buscador');
    var filtro = (entrada.value.toUpperCase()).normalize("NFD").replace(/[\u0300-\u036f]/g, "");;
    var listaPokemon = document.getElementById('lista');
    var pokemonIcono = listaPokemon.getElementsByClassName('pokemon-card');

    for (var i = 0; i < pokemonIcono.length; i++) {
        var nombre = pokemonIcono[i].getElementsByTagName('h2')[0];
        if (nombre) {
            var txtValor = nombre.textContent || nombre.innerText;
            if (txtValor.toUpperCase().indexOf(filtro) > -1) {
                pokemonIcono[i].style.display = "";
            } else {
                pokemonIcono[i].style.display = "none";
            }
        }
    }
}

//Funcion para efecto de carta
function tiltEffect(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const maxAngle = 15;

    const tiltX = (y / rect.height) * maxAngle * 2;
    const tiltY = (x / rect.width) * maxAngle * -2;

    this.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
}

function resetTiltEffect(e) {
    this.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
}

function startTiltEffect(e) {
    this.style.transition = 'transform 0.1s ease-out';
}

//Limpiar contenedor de texto
document.getElementById('Limpiar').addEventListener('click', function() {
    document.getElementById('buscador').value = '';
    BuscarPokemon();
});

//Voz a texto
let VozRec;
if ('webkitSpeechRecognition' in window) {
    VozRec = new webkitSpeechRecognition();
    VozRec.lang = 'es-ES';
    VozRec.continuous = false;
    VozRec.interimResults = false;

    VozRec.onresult = function(event) {
        let transcript = event.results[0][0].transcript;
        transcript = transcript.replace(".", '');
        document.getElementById('buscador').value = transcript;
        BuscarPokemon();
    };

    VozRec.onerror = function(event) {
        console.error('Error de reconocimiento de voz: ', event.error);
    }
}

document.getElementById('Mic').addEventListener('click', function() {
    VozRec.start();
});

//Modo escuro
document.getElementById('ModoOscuro').addEventListener('click', function() { 
    var body = document.body;
    var icon = document.getElementById('DMIcono');
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
        this.className = 'btn btn-light position-fixed top-0 end-0 m-3';
    } else {
        icon.className = 'fas fa-moon';
        this.className = 'btn btn-dark position-fixed top-0 end-0 m-3';
    }

    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

document.addEventListener('DOMContentLoaded', function() {
    var icon = document.getElementById('DMIcono');
    var boton = document.getElementById('ModoOscuro');
    if (localStorage.getItem('darkMode') === 'false') {
        document.body.classList.add('dark-mode');
        icon.className = 'fas fa-sun';
        boton.className = 'btn btn-light position-fixed top-0 end-0 m-3';
    } else {
        icon.className = 'fas fa-moon';
        boton.className = 'btn btn-dark position-fixed top-0 end-0 m-3';
    }
});