document.addEventListener('DOMContentLoaded', function() {
    const ListaPokemon = document.getElementById('lista');
    const DetallesPokemon = document.getElementById('detalles');

    fetch('http://localhost:3000/pokedex')
        .then(response => response.json())
        .then(pokemonLista => {
                    pokemonLista.forEach(pokemon => {
                        const pokemonIcono = document.createElement('div');
                        pokemonIcono.classList.add('pokemon-card', `generacion-${pokemon.generacion}`);
                        pokemonIcono.innerHTML = `
                            <h2>${pokemon.nombre}</h2>
                            <img src="${pokemon.imagen}" alt="${pokemon.numero_pokedex}">
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

        const tipos = pokemon.tipo.split(',').map(tipo => {
            const tipoClase = `tipo-${tipo.trim()}`;
            return `<span class="${tipoClase}">${tipo.trim()}</span>`;
        }).join(', ');
        const debilidades = pokemon.debilidades.split(',').map(debilidad => {
            const debilidadClase = `tipo-${debilidad.trim()}`;
                return `<span class="${debilidadClase}">${debilidad.trim()}</span>`;
        }).join(', ');

        DetallesPokemon.innerHTML = `

        <div class="detalle-flex-container">
        <div class="detalle-imagen">
            <img src="${pokemon.imagen}" alt="${pokemon.nombre}">
        </div>
        <div class="detalle-info">
            <h2>${pokemon.nombre} (#${pokemon.numero_pokedex})</h2>
            <p>${pokemon.descripcion}</p>
            <p>Tipo: ${tipos}</p>
            <p>CP Máximo: ${pokemon.max_cp}</p>
            <p>HP Máximo: ${pokemon.max_hp}</p>
            <p>Ataque: ${pokemon.ataque}</p>
            <p>Defensa: ${pokemon.defensa}</p>
            <p>Stamina: ${pokemon.stamina}</p>
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

    }

});

document.addEventListener("click", function(e){
    const detalles = document.getElementById('detalles');
    if (!detalles.contains(e.target) && detalles.style.display !== "none") {
        detalles.style.display = "none";
    }
});

function BuscarPokemon() {
    var entrada = document.getElementById('buscador');
    var filtro = entrada.value.toUpperCase();
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


function tiltEffect(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Máximo ángulo de rotación
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