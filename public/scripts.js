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
                        `;
                        pokemonIcono.onclick = function() {
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

            
        `;
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