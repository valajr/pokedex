const API = {
    'POKEMON': "https://pokeapi.co/api/v2/pokemon/",
    'LIMITLESS': "?limit=10000",
    'SPECIE': "https://pokeapi.co/api/v2/pokemon-species/",
    'ENCOUNTER': "/encounters"
};

let id = 1;
let max_pokemon = 898;

let pokemon_mini_name = document.getElementsByClassName("pokemon-mini-name");
let pokemon_mini_img = document.getElementsByClassName("pokemon-mini-img");
let pokemon_selected_name = document.getElementById("pokemon-selected-name");
let pokemon_selected_img = document.getElementById("pokemon-selected-img");

let pokemon_type = document.getElementsByClassName("type");
let pokemon_img = document.getElementById("pokemon-image");
let pokemon_evolutions = document.getElementById("pokemon-evolutions");


let pokemon_name = document.getElementById("pokemon-name");
let pokemon_description = document.getElementById("pokemon-description");
let pokemon_maps = document.getElementById("pokemon-map");

const fetchPokemon = async (pokemon) => {
    const APIResponse = await fetch(pokemon);
    const data = await APIResponse.json();
    return data;
}

// const maxPokemon = async () => {
//     let data = await fetchPokemon(API.POKEMON + API.LIMITLESS);
//     return (data['results'].length); // return data.count;
// }

function getPokemonDataAnimated(data) {
    let poke = `${data.id} - ${data.name}`;
    let img_src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
    if(!img_src) {
        img_src = data['sprites']['versions']['generation-v']['black-white']['front_default'];
    }
    return [poke, img_src];
}

function getPokemonData(data) {
    let poke = `${data.id} - ${data.name}`;
    let img_src = data['sprites']['versions']['generation-v']['black-white']['front_default'];
    return [poke, img_src];
}

function hideMap() {
    let map_popup = document.getElementById("map-popup");
    map_popup.innerHTML = '';
    map_popup.setAttribute('hidden', true);
}

function showMap(map) {
    document.getElementById("map-popup").removeAttribute('hidden');
    document.getElementById("map-popup").innerHTML = `<img src="./import/toolbox/maps/${map}-2.png" alt="${map}" onclick="hideMap()" />`;
    setTimeout(hideSkillTree, 5000);
}

function showMiniMap(map) {
    pokemon_maps.innerHTML = `<img src="./import/toolbox/maps/${map}-1.png" alt="${map}" onclick="showMap('${map}')" />`;
}

function createButton(map) {
    let button = document.createElement("button");
    button.setAttribute("id", map);
    button.setAttribute("class", "btn-map");
    button.addEventListener("click", () => {
        this.showMiniMap(map);
    });
    button.innerHTML = map;
    return button;
}

const renderPokemon = async (pokemon) => {
    if(pokemon < 1) {
        pokemon = 1;
    }
    // max_pokemon = await maxPokemon();
    if(pokemon > max_pokemon) {
        pokemon = max_pokemon;
    }
    
    pokemon_type[0].innerHTML = '';
    pokemon_type[1].innerHTML = '';
    let data = await fetchPokemon(API.POKEMON + pokemon);
    let name_pokemon = data.name;
    id = data.id;
    let [poke, img_src] = getPokemonDataAnimated(data);
    pokemon_selected_name.innerHTML = poke;
    pokemon_selected_img.src = img_src;
    pokemon_type[0].innerHTML = data['types'][0]['type']['name'];
    if(data['types'].length > 1) {
        pokemon_type[1].innerHTML = data['types'][1]['type']['name'];
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
    pokemon_description.innerHTML = data['flavor_text_entries'][count]['flavor_text'].replaceAll('\f', '<br>');
    let pokemon_evolution = [];
    pokemon_evolutions.innerHTML = '';
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
    if(!pokemon_evolution[0]) {
        pokemon_evolutions.innerHTML = "Not evolued."
    }
    else {
        pokemon_evolutions.innerHTML = pokemon_evolution;
    }

    let pokemon_map = document.createElement("table");
    pokemon_map.setAttribute("class", "table-map");
    pokemon_maps.innerHTML = "Not encounter.";
    data = await fetchPokemon(API.POKEMON + pokemon + API.ENCOUNTER);
    if (data[0]['location_area']['name']) {
        pokemon_maps.innerHTML = '';
        for(let i in data) {
            map = data[i]['location_area']['name'];
            map = map.replace("-area", '');
            pokemon_map.appendChild(createButton(map));
        }
        pokemon_maps.appendChild(pokemon_map);
    }

    if(id > 3) {
        pokemon_mini_img[0].removeAttribute('hidden');
        data = await fetchPokemon(API.POKEMON + (pokemon - 3));
        [poke, img_src] = getPokemonData(data);
        pokemon_mini_name[0].innerHTML = poke;
        pokemon_mini_img[0].src = img_src;
    }
    else {
        pokemon_mini_img[0].setAttribute('hidden', true);
        pokemon_mini_name[0].innerHTML = '';
    }
    if(id > 2) {
        pokemon_mini_img[1].removeAttribute('hidden');
        data = await fetchPokemon(API.POKEMON + (pokemon - 2));
        [poke, img_src] = getPokemonData(data);
        pokemon_mini_name[1].innerHTML = poke;
        pokemon_mini_img[1].src = img_src;
    }
    else {
        pokemon_mini_img[1].setAttribute('hidden', true);
        pokemon_mini_name[1].innerHTML = '';
    }

    if(id > 1) {
        pokemon_mini_img[2].removeAttribute('hidden');
        data = await fetchPokemon(API.POKEMON + (pokemon - 1));
        [poke, img_src] = getPokemonData(data);
        pokemon_mini_name[2].innerHTML = poke;
        pokemon_mini_img[2].src = img_src;
    }
    else {
        pokemon_mini_img[2].setAttribute('hidden', true);
        pokemon_mini_name[2].innerHTML = '';
    }


    if(id < max_pokemon) {
        pokemon_mini_img[3].removeAttribute('hidden', true);
        data = await fetchPokemon(API.POKEMON + (pokemon + 1));
        [poke, img_src] = getPokemonData(data);
        pokemon_mini_name[3].innerHTML = poke;
        pokemon_mini_img[3].src = img_src;
    }
    else {
        pokemon_mini_img[3].setAttribute('hidden', true);
        pokemon_mini_name[3].innerHTML = '';
    }

    if(id < max_pokemon - 1) {
        pokemon_mini_img[4].removeAttribute('hidden', true);
        data = await fetchPokemon(API.POKEMON + (pokemon + 2));
        [poke, img_src] = getPokemonData(data);
        pokemon_mini_name[4].innerHTML = poke;
        pokemon_mini_img[4].src = img_src;
    }
    else {
        pokemon_mini_img[4].setAttribute('hidden', true);
        pokemon_mini_name[4].innerHTML = '';
    }

    if(id < max_pokemon - 2) {
        pokemon_mini_img[5].removeAttribute('hidden', true);
        data = await fetchPokemon(API.POKEMON + (pokemon + 3));
        [poke, img_src] = getPokemonData(data);
        pokemon_mini_name[5].innerHTML = poke;
        pokemon_mini_img[5].src = img_src;
    }
    else {
        pokemon_mini_img[5].setAttribute('hidden', true);
        pokemon_mini_name[5].innerHTML = '';
    }
}

function arrowUpEvent() {
    renderPokemon(id-1);
}

function arrowDownEvent() {
    renderPokemon(id+1);
}

renderPokemon(id);