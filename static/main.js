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
let pokemon_selected_name = document.getElementById("pokemonSelectedName");
let pokemon_selected_img = document.getElementById("pokemonSelectedImg");

let pokemon_type = document.getElementsByClassName("type");
let pokemon_img = document.getElementById("pokemonImage");
let pokemon_evolutions = document.getElementById("pokemonEvolutions");


let pokemon_name = document.getElementById("pokemonName");
let pokemon_description = document.getElementById("pokemonDescription");
let pokemon_maps = document.getElementById("pokemonMap");

const fetchPokemon = async (pokemon) => {
    const APIResponse = await fetch(pokemon);
    const data = await APIResponse.json();
    return data;
}

function getPokemonData(data, animated=false) {
    let poke = `${data.id} - ${data.name}`;
    let img_src = data['sprites']['versions']['generation-v']['black-white']['front_default'];
    let img_src_animated = 0;

    if(animated) {
        img_src_animated = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
        if(!img_src_animated) {
                img_src_animated = img_src;
            }
    }

    return [poke, img_src, img_src_animated];
}

function hideMap() {
    let map_popup = document.getElementById("mapPopup");
    map_popup.innerHTML = '';
    map_popup.setAttribute("hidden", true);
}

function showMap(map) {
    document.getElementById("mapPopup").removeAttribute('hidden');
    document.getElementById("mapPopup").innerHTML = `<img src="./import/toolbox/maps/${map}-2.png" alt="${map}" onclick="hideMap()" />`;
    setTimeout(hideMap, 5000);
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
    button.innerHTML = map.replace("-", ' ');
    return button;
}

const renderPokemon = async (pokemon) => {
    if(pokemon < 1) {
        pokemon = 1;
    }
    
    if(pokemon > max_pokemon) {
        pokemon = max_pokemon;
    }

    id = pokemon;
    pokemon_type[0].innerHTML = '';
    pokemon_type[0].setAttribute("class", "type");
    pokemon_type[1].innerHTML = '';
    pokemon_type[1].setAttribute("class", "type");
    pokemon_evolutions.innerHTML = '';
    pokemon_evolutions.innerHTML = "Not evolued.";
    pokemon_maps.innerHTML = '';
    pokemon_maps.innerHTML = "Not encounter.";

    let pokemon_data = JSON.parse(localStorage.getItem(pokemon));
    if(pokemon_data){
        pokemon_selected_name.innerHTML = pokemon_data['id-name'];
        pokemon_selected_img.src = pokemon_data['img-animated'];
        pokemon_img.src = pokemon_data['img-animated'];
        pokemon_name.innerHTML = pokemon_data['id-name'];

        let type_01 = pokemon_data['type-1'];
        let type_02 = pokemon_data['type-2'];
        pokemon_type[0].innerHTML = type_01;
        pokemon_type[0].classList.add(`type-${type_01}`);
        if(type_02) {
            pokemon_type[1].innerHTML = type_02;
            pokemon_type[1].classList.add(`type-${type_02}`);
        }

        pokemon_description.innerHTML = pokemon_data['description'];

        if(pokemon_data['evolutions']) {
            pokemon_evolutions.innerHTML = pokemon_data['evolutions'];
        }

        let local = pokemon_data['local'];
        if (local) {
            let pokemon_map = document.createElement("table");
            
            for(let i in local) {
                pokemon_map.appendChild(createButton(local[i]));
            }
            pokemon_maps.appendChild(pokemon_map);
        }
    }
    else {
        let data = await fetchPokemon(API.POKEMON + pokemon);
        let name_pokemon = data.name;
        let [poke, img_src, img_src_animated] = getPokemonData(data, true);
        pokemon_selected_name.innerHTML = poke;
        pokemon_selected_img.src = img_src_animated;
        pokemon_img.src = img_src_animated;
        pokemon_name.innerHTML = poke;

        let type_01,  type_02;
        type_01 = data['types'][0]['type']['name'];
        pokemon_type[0].innerHTML = type_01;
        pokemon_type[0].classList.add(`type-${type_01}`);
        if(data['types'].length > 1) {
            type_02 = data['types'][1]['type']['name'];
            pokemon_type[1].innerHTML = type_02;
            pokemon_type[1].classList.add(`type-${type_02}`);
        }
        else {
            type_02 = null;
        }

        data = await fetchPokemon(API.SPECIE + pokemon);
        let language;
        let count = -1;
        while(language != 'en') {
            count++;
            language = data['flavor_text_entries'][count]['language']['name'];
        }
        let description = data['flavor_text_entries'][count]['flavor_text'].replaceAll('\f', '<br>');
        pokemon_description.innerHTML = description;

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
        if(pokemon_evolution[0]) {
            pokemon_evolutions.innerHTML = pokemon_evolution;
        }
        else {
            pokemon_evolution = null;
        }

        let pokemon_map = document.createElement("table");
        let pokemon_local = [];
        data = await fetchPokemon(API.POKEMON + pokemon + API.ENCOUNTER);
        if (data.length && data[0]['location_area']['name']) {
            pokemon_maps.innerHTML = '';
            for(let i in data) {
                map = data[i]['location_area']['name'];
                map = map.replace("-area", '');
                pokemon_map.appendChild(createButton(map));
                pokemon_local.push(map);
            }
            pokemon_maps.appendChild(pokemon_map);
        }
        else {
            pokemon_map = null;
        }

        pokemon_data = {
            'id-name': poke,
            'type-1': type_01,
            'type-2': type_02,
            'img-animated': img_src_animated,
            'img': img_src,
            'description': description,
            'evolutions': pokemon_evolution,
            'local': pokemon_local
        };
        localStorage.setItem(pokemon, JSON.stringify(pokemon_data));
    }

    if(id > 3) {
        pokemon_mini_img[0].removeAttribute('hidden');
        pokemon_data = JSON.parse(localStorage.getItem(pokemon - 3));

        if(pokemon_data) {
            pokemon_mini_name[0].innerHTML = pokemon_data['id-name'];
            pokemon_mini_img[0].src = pokemon_data['img'];
        }
        else {
            data = await fetchPokemon(API.POKEMON + (pokemon - 3));
            [poke, img_src] = getPokemonData(data);
            pokemon_mini_name[0].innerHTML = poke;
            pokemon_mini_img[0].src = img_src;
        }
    }
    else {
        pokemon_mini_img[0].setAttribute('hidden', true);
        pokemon_mini_name[0].innerHTML = '';
    }
    if(id > 2) {
        pokemon_mini_img[1].removeAttribute('hidden');
        pokemon_data = JSON.parse(localStorage.getItem(pokemon - 2));

        if(pokemon_data) {
            pokemon_mini_name[1].innerHTML = pokemon_data['id-name'];
            pokemon_mini_img[1].src = pokemon_data['img'];
        }
        else {
            data = await fetchPokemon(API.POKEMON + (pokemon - 2));
            [poke, img_src] = getPokemonData(data);
            pokemon_mini_name[1].innerHTML = poke;
            pokemon_mini_img[1].src = img_src;
        }
    }
    else {
        pokemon_mini_img[1].setAttribute('hidden', true);
        pokemon_mini_name[1].innerHTML = '';
    }

    if(id > 1) {
        pokemon_mini_img[2].removeAttribute('hidden');
        pokemon_data = JSON.parse(localStorage.getItem(pokemon - 1));

        if(pokemon_data) {
            pokemon_mini_name[2].innerHTML = pokemon_data['id-name'];
            pokemon_mini_img[2].src = pokemon_data['img'];
        }
        else {
            data = await fetchPokemon(API.POKEMON + (pokemon - 1));
            [poke, img_src] = getPokemonData(data);
            pokemon_mini_name[2].innerHTML = poke;
            pokemon_mini_img[2].src = img_src;
        }
    }
    else {
        pokemon_mini_img[2].setAttribute('hidden', true);
        pokemon_mini_name[2].innerHTML = '';
    }


    if(id < max_pokemon) {
        pokemon_mini_img[3].removeAttribute('hidden');
        pokemon_data = JSON.parse(localStorage.getItem(pokemon + 1));

        if(pokemon_data) {
            pokemon_mini_name[3].innerHTML = pokemon_data['id-name'];
            pokemon_mini_img[3].src = pokemon_data['img'];
        }
        else {
            data = await fetchPokemon(API.POKEMON + (pokemon + 1));
            [poke, img_src] = getPokemonData(data);
            pokemon_mini_name[3].innerHTML = poke;
            pokemon_mini_img[3].src = img_src;
        }
    }
    else {
        pokemon_mini_img[3].setAttribute('hidden', true);
        pokemon_mini_name[3].innerHTML = '';
    }

    if(id < max_pokemon - 1) {
        pokemon_mini_img[4].removeAttribute('hidden');
        pokemon_data = JSON.parse(localStorage.getItem(pokemon + 2));

        if(pokemon_data) {
            pokemon_mini_name[4].innerHTML = pokemon_data['id-name'];
            pokemon_mini_img[4].src = pokemon_data['img'];
        }
        else {
            data = await fetchPokemon(API.POKEMON + (pokemon + 2));
            [poke, img_src] = getPokemonData(data);
            pokemon_mini_name[4].innerHTML = poke;
            pokemon_mini_img[4].src = img_src;
        }
    }
    else {
        pokemon_mini_img[4].setAttribute('hidden', true);
        pokemon_mini_name[4].innerHTML = '';
    }

    if(id < max_pokemon - 2) {
        pokemon_mini_img[5].removeAttribute('hidden');
        pokemon_data = JSON.parse(localStorage.getItem(pokemon + 3));

        if(pokemon_data) {
            pokemon_mini_name[5].innerHTML = pokemon_data['id-name'];
            pokemon_mini_img[5].src = pokemon_data['img'];
        }
        else {
            data = await fetchPokemon(API.POKEMON + (pokemon + 3));
            [poke, img_src] = getPokemonData(data);
            pokemon_mini_name[5].innerHTML = poke;
            pokemon_mini_img[5].src = img_src;
        }
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