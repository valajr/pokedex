const API = {
    'POKEMON': "https://pokeapi.co/api/v2/pokemon/",
    'LIMITLESS': "?limit=10000",
    'SPECIE': "https://pokeapi.co/api/v2/pokemon-species/",
    'ENCOUNTER': "/encounters"
};

let id = 11553;
let max_pokemon = 898;

let pokemon_mini_prev_1_img = document.getElementById("pokemonMiniPrev1Img");
let pokemon_mini_prev_1_name = document.getElementById("pokemonMiniPrev1Name");
let pokemon_mini_prev_2_img = document.getElementById("pokemonMiniPrev2Img");
let pokemon_mini_prev_2_name = document.getElementById("pokemonMiniPrev2Name");
let pokemon_mini_prev_3_img = document.getElementById("pokemonMiniPrev3Img");
let pokemon_mini_prev_3_name = document.getElementById("pokemonMiniPrev3Name");

let pokemon_mini_img = document.getElementById("pokemonMiniImg");
let pokemon_mini_name = document.getElementById("pokemonMiniName");

let pokemon_mini_next_1_img = document.getElementById("pokemonMiniNext1Img");
let pokemon_mini_next_1_name = document.getElementById("pokemonMiniNext1Name");
let pokemon_mini_next_2_img = document.getElementById("pokemonMiniNext2Img");
let pokemon_mini_next_2_name = document.getElementById("pokemonMiniNext2Name");
let pokemon_mini_next_3_img = document.getElementById("pokemonMiniNext3Img");
let pokemon_mini_next_3_name = document.getElementById("pokemonMiniNext3Name");


let pokemon_type_1 = document.getElementById("type1");
let pokemon_type_2 = document.getElementById("type2");
let pokemon_img = document.getElementById("pokemonImage");
let pokemon_evolutions = document.getElementById("pokemonEvolutions");


let pokemon_name = document.getElementById("pokemonName");
let pokemon_description = document.getElementById("pokemonDescription");
let pokemon_map = document.getElementById("pokemonMap");

const fetchPokemon = async (pokemon) => {
    const APIResponse = await fetch(pokemon);
    const data = await APIResponse.json();
    return data;
}

// const maxPokemon = async () => {
//     let data = await fetchPokemon(API.POKEMON + API.LIMITLESS);
//     return (data['results'].length); // return data.count;
// }

function getPokemonData(data) {
    let poke = `${data.id} - ${data.name}`;
    let img_src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
    if(!img_src) {
        img_src = data['sprites']['versions']['generation-v']['black-white']['front_default'];
    }
    return [poke, img_src];
}

const renderPokemon = async (pokemon) => {
    if(pokemon < 1) {
        pokemon = 1;
    }
    // max_pokemon = await maxPokemon();
    if(pokemon > max_pokemon) {
        pokemon = max_pokemon;
    }

    let data = await fetchPokemon(API.POKEMON + pokemon);
    let name_pokemon = data.name;
    id = data.id;
    let [poke, img_src] = getPokemonData(data);
    pokemon_mini_name.innerHTML = poke;
    pokemon_mini_img.src = img_src;
    pokemon_type_1.innerHTML = data['types'][0]['type']['name'];
    if(data['types'].length > 1) {
        pokemon_type_2.innerHTML = data['types'][1]['type']['name'];
    }
    pokemon_img.src = img_src;
    pokemon_name.innerHTML = poke;

    data = await fetchPokemon(API.SPECIE + pokemon);
    let language;
    let count = -1;
    while(language != 'en') {
        count++;
        language = data['flavor_text_entries'][count]['language']['name'];
    }
    pokemon_description.innerHTML = data['flavor_text_entries'][count]['flavor_text'];
    let pokemon_evolution = [];
    if(data['evolution_chain']) {
            let evolution = data['evolution_chain']['url'];
        data = await fetchPokemon(evolution);
        pokemon_evolution.push(data.chain.species.name);
        let stage_01 = data['chain']['evolves_to'];
        for(let s in stage_01) {
            pokemon_evolution.push(stage_01[s]['species']['name']);
            let stage_02 = stage_01[s]['evolves_to'];
            for(let ss in stage_02) {
                pokemon_evolution.push(stage_02[ss]['species']['name']);
            }
        }
        for(let p in pokemon_evolution) {
            if(pokemon_evolution[p] == name_pokemon) {
                pokemon_evolution.splice(p, 1);
            }
        }
    }
    pokemon_evolutions.innerHTML = pokemon_evolution;

    pokemon_map.innerHTML = '';
    data = await fetchPokemon(API.POKEMON + pokemon + API.ENCOUNTER);
    for(let i in data) {
        pokemon_map.innerHTML += ' ' + data[i]['location_area']['name'];
    }

    if(id > 3) {
        pokemon_mini_prev_1_img.removeAttribute('hidden');
        data = await fetchPokemon(API.POKEMON + (pokemon - 3));
        [poke, img_src] = getPokemonData(data);
        pokemon_mini_prev_1_name.innerHTML = poke;
        pokemon_mini_prev_1_img.src = img_src;
    }
    else {
        pokemon_mini_prev_1_img.setAttribute('hidden', true);
        pokemon_mini_prev_1_name.innerHTML = '';
    }
    if(id > 2) {
        pokemon_mini_prev_2_img.removeAttribute('hidden');
        data = await fetchPokemon(API.POKEMON + (pokemon - 2));
        [poke, img_src] = getPokemonData(data);
        pokemon_mini_prev_2_name.innerHTML = poke;
        pokemon_mini_prev_2_img.src = img_src;
    }
    else {
        pokemon_mini_prev_2_img.setAttribute('hidden', true);
        pokemon_mini_prev_2_name.innerHTML = '';
    }

    if(id > 1) {
        pokemon_mini_prev_3_img.removeAttribute('hidden');
        data = await fetchPokemon(API.POKEMON + (pokemon - 1));
        [poke, img_src] = getPokemonData(data);
        pokemon_mini_prev_3_name.innerHTML = poke;
        pokemon_mini_prev_3_img.src = img_src;
    }
    else {
        pokemon_mini_prev_3_img.setAttribute('hidden', true);
        pokemon_mini_prev_3_name.innerHTML = '';
    }


    if(id < max_pokemon) {
        pokemon_mini_next_1_img.removeAttribute('hidden', true);
        data = await fetchPokemon(API.POKEMON + (pokemon + 1));
        [poke, img_src] = getPokemonData(data);
        pokemon_mini_next_1_name.innerHTML = poke;
        pokemon_mini_next_1_img.src = img_src;
    }
    else {
        pokemon_mini_next_1_img.setAttribute('hidden', true);
        pokemon_mini_next_1_name.innerHTML = '';
    }

    if(id < max_pokemon - 1) {
        pokemon_mini_next_2_img.removeAttribute('hidden', true);
        data = await fetchPokemon(API.POKEMON + (pokemon + 2));
        [poke, img_src] = getPokemonData(data);
        pokemon_mini_next_2_name.innerHTML = poke;
        pokemon_mini_next_2_img.src = img_src;
    }
    else {
        pokemon_mini_next_2_img.setAttribute('hidden', true);
        pokemon_mini_next_2_name.innerHTML = '';
    }

    if(id < max_pokemon - 2) {
        pokemon_mini_next_3_img.removeAttribute('hidden', true);
        data = await fetchPokemon(API.POKEMON + (pokemon + 3));
        [poke, img_src] = getPokemonData(data);
        pokemon_mini_next_3_name.innerHTML = poke;
        pokemon_mini_next_3_img.src = img_src;
    }
    else {
        pokemon_mini_next_3_img.setAttribute('hidden', true);
        pokemon_mini_next_3_name.innerHTML = '';
    }
}

function arrowUpEvent() {
    renderPokemon(id-1);
}

function arrowDownEvent() {
    renderPokemon(id+1);
}

renderPokemon(id);