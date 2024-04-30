const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const rowContainer = document.getElementById("container");

const pokemonImage = document.getElementById('pokemonSprite');


const randId = Math.floor(Math.random() * 300);
let randData;

// Function to fetch Pokémon names from the PokeAPI
async function fetchPokemonNames() {
    try {
        const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=1000`);
        if (!response.ok) {
            throw new Error('Failed to fetch Pokémon names');
        }
        const data = await response.json();
        return data.results.map(pokemon => pokemon.name);
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Function to fetch Pokémon details from the PokeAPI
async function fetchPokemonDetails(pokemonName) {
    try {
        const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${pokemonName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch details for ${pokemonName}`);
        }
        const data = await response.json();
        return { name: data.name, image: data.sprites.front_default };
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Function to update the autocomplete list based on user input
async function updateAutocompleteList(inputValue) {
    const autocompleteList = document.getElementById('autocompleteList');
    autocompleteList.innerHTML = '';

    const pokemonNames = await fetchPokemonNames();
    const filteredPokemons = pokemonNames.filter(pokemon =>
        pokemon.toLowerCase().startsWith(inputValue.toLowerCase())
    );

    for (const pokemonName of filteredPokemons) {
        const pokemonDetails = await fetchPokemonDetails(pokemonName);
        if (pokemonDetails) {
            const listItem = document.createElement('div');
            listItem.classList.add('autocompleteItem');

            const img = document.createElement('img'); // Create an <img> element
            img.src = pokemonDetails.image; // Set the source of the image
            img.alt = pokemonDetails.name; // Set the alt attribute of the image
            listItem.appendChild(img); // Append the image

            const span = document.createElement('span'); // Create a <span> element
            span.textContent = pokemonDetails.name; // Set the text content of the span
            listItem.appendChild(span); // Append the span

            autocompleteList.appendChild(listItem); // Append the list item to the autocomplete list
        }
    }
}


// Event listener for input field
document.getElementById('pokemonInput').addEventListener('input', function () {
    const inputValue = this.value.trim();
    if (inputValue === '') {
        document.getElementById('autocompleteList').innerHTML = '';
        return;
    }
    updateAutocompleteList(inputValue);
});

// Event listener for selecting an autocomplete item
document.getElementById('autocompleteList').addEventListener('click', function (event) {
    const selectedPokemonName = event.target.textContent;
    document.getElementById('pokemonInput').value = selectedPokemonName;
    document.getElementById('autocompleteList').innerHTML = ''; // Clear autocomplete list

});





async function generatePokemon() {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randId}`);
    const data = await response.json();
    console.log(data);
    randData = data;
}
document.addEventListener("DOMContentLoaded", function () {
    generatePokemon();

})


async function fetchData() {

    try {

        const pokemonInput = document.getElementById("pokemonInput").value.toLowerCase();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonInput}`);
        if (!response.ok) {
            throw new Error("Could not fetch resource.");
        }

        const data = await response.json();
        console.log(data);
        determineDiv(data);
        const pokeSprite = data.sprites.front_default;
        const imgElement = document.getElementById("pokemonSprite");
        imgElement.src = pokeSprite;
        imgElement.style.display = "flex";


    }
    catch (error) {
        console.error(error);
    }

}


function retryGame() {
    location.reload();
}

function solutionBtn() {
    const mySolution = document.getElementById("solution");

    if (mySolution.textContent == "") {
        mySolution.textContent = (randData.name);
    }
    else {
        mySolution.textContent = "";
    }
}

async function determineDiv(data) {
    const attributes = document.querySelectorAll(".details");

    await determineType1(attributes, data);
    await delay(500);
    await determineType2(attributes, data);
    await delay(500);
    await determineHabitats(attributes, data);
    await delay(500);
    await determineColor(attributes, data);
    await delay(500);
    await determineStage(attributes, data);
    await delay(500);
    await determineHeight(attributes, data);
    await delay(500);
    await determineWeight(attributes, data);

    if (data.name == randData.name) {
        const message = document.getElementById("winMsg");
        message.textContent = "You've won!";
    } else {

    }
}



function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function determineType1(attributes, data) {

    // console.log(data.types[1].type.name);
    // console.log(randData.types[1].type.name);


    if (data.types[0].type.name == randData.types[0].type.name) { //Determines Type 1
        attributes[1].style.backgroundColor = "lightgreen";
        attributes[1].textContent = data.types[0].type.name;
    }
    else {
        attributes[1].style.backgroundColor = "tomato";
        attributes[1].textContent = data.types[0].type.name;
    }




}

function determineType2(attributes, data) {
    if (data.types.length < 2) {
        data.types.push({ type: { name: `none`, url: `` } });
    }
    if (randData.types.length < 2) {
        randData.types.push({ type: { name: `none`, url: `` } });
    }

    if (data.types[1].type.name == randData.types[1].type.name) { //Determines Type 2
        attributes[2].style.backgroundColor = "lightgreen";
        attributes[2].textContent = data.types[1].type.name;
    }
    else {
        attributes[2].style.backgroundColor = "tomato";
        attributes[2].textContent = data.types[1].type.name;
    }

}

async function determineHabitats(attributes, data) {

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.name}`);
    const response2 = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${randData.name}`);
    if (!response.ok || !response2.ok) {
        throw new Error("could not fetch resource.");
    }

    const pokemonHabitat = await response.json();
    const randomPokemonHabitat = await response2.json();

    // console.log(pokemonHabitat.habitat.name);
    // console.log(randomPokemonHabitat.habitat.name);
    if (pokemonHabitat.habitat == null) {
        attributes[3].style.backgroundColor = "tomato";
        attributes[3].textContent = "unknown";
    }
    else if (pokemonHabitat.habitat.name == randomPokemonHabitat.habitat.name) { //Determines Habitat.
        attributes[3].style.backgroundColor = "lightgreen";
        attributes[3].textContent = pokemonHabitat.habitat.name;
    }
    else {
        attributes[3].style.backgroundColor = "tomato";
        attributes[3].textContent = pokemonHabitat.habitat.name;
        
    } 




}


// I will write plenty of random 
// text but not lorem ipsum because 
// i dont feel like it, we will use 
// this text for the merge


async function determineColor(attributes, data) {

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.name}`);
    const response2 = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${randData.name}`);
    if (!response.ok || !response2.ok) {
        throw new Error("could not fetch resource.");
    }

    const pokemonColor = await response.json();
    const randomPokemonColor = await response2.json();

    // console.log(pokemonColor.color.name);
    // console.log(randomPokemonColor.color.name);

    if (pokemonColor.color.name == randomPokemonColor.color.name) { //Determines Habitat.
        attributes[4].style.backgroundColor = "lightgreen";
        attributes[4].textContent = pokemonColor.color.name;
    }
    else {
        attributes[4].style.backgroundColor = "tomato";
        attributes[4].textContent = pokemonColor.color.name;
    }

}


async function determineStage(attributes, data) {
    try {
        const speciesUrl = data.species.url;            //Getting the pokemon's evolution chain
        const speciesResponse = await fetch(speciesUrl);
        const speciesData = await speciesResponse.json();
        const evolutionChainUrl = speciesData.evolution_chain.url;
        const evolutionChainResponse = await fetch(evolutionChainUrl);
        const evolutionChainData = await evolutionChainResponse.json();
        const chain = evolutionChainData.chain;

        let stage = 1;
        let current = chain;
        while (current.species.name !== data.name) { //Raising the "stage" by 1 each time the evolution chain name isn't equal to the pokemon's name.
            current = current.evolves_to[0];
            stage++;
        }

        let randStage = await determineRandomStage(randData);

        // console.log(stage);
        // console.log(randStage);
        if (stage == randStage) {  // Determines Stage.
            attributes[5].style.backgroundColor = "lightgreen";
            attributes[5].textContent = stage;
        }
        else {
            attributes[5].style.backgroundColor = "tomato";
            attributes[5].textContent = stage;
        }

    } catch (error) {
        console.error("Error fetching evolution stage:", error);
    }
}

async function determineRandomStage(data) {

    try {
        const speciesUrl = data.species.url;
        const speciesResponse = await fetch(speciesUrl);
        const speciesData = await speciesResponse.json();
        const evolutionChainUrl = speciesData.evolution_chain.url;
        const evolutionChainResponse = await fetch(evolutionChainUrl);
        const evolutionChainData = await evolutionChainResponse.json();
        const chain = evolutionChainData.chain;
        let stage = 1;
        let current = chain;

        while ((current.species.name) !== data.name) {
            current = current.evolves_to[0];
            stage++;
        }
        return stage;
    } catch (error) {
        console.error("Error fetching evolution stage:", error);
    }
}

async function determineHeight(attributes, data) {

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${data.name}`);
    const pokemonData = await response.json();

    // console.log(randData.height / 10);
    // console.log(pokemonData.height);
    if (pokemonData.height > randData.height) {
        attributes[6].src = "images/images.png";
        attributes[6].textContent = `Too tall: ${((pokemonData.height) / 10).toFixed(1)}m`;
        attributes[6].style.backgroundColor = "tomato";
    }
    else if (pokemonData.weight < randData.weight) {
        attributes[6].src = "images/arrowup.jpg";
        attributes[6].textContent = `Too short: ${((pokemonData.height) / 10).toFixed(1)}m`
        attributes[6].style.backgroundColor = "tomato";
    }
    else if (pokemonData.weight = randData.weight) {
        attributes[6].textContent = `${((pokemonData.height) / 10).toFixed(1)}m`;
        attributes[6].style.backgroundColor = "lightgreen";

    }

}

async function determineWeight(attributes, data) {

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${data.name}`);
    const pokemonData = await response.json();

    // console.log(randData.weight / 10);
    // console.log(pokemonData.weight);
    if (pokemonData.weight > randData.weight) {

        attributes[7].textContent = `Too heavy: ${((pokemonData.weight) / 10).toFixed(1)}kg`;
        attributes[7].style.backgroundColor = "tomato";
    }
    else if (pokemonData.weight < randData.weight) {

        attributes[7].textContent = `Too light: ${((pokemonData.weight) / 10).toFixed(1)}kg`;
        attributes[7].style.backgroundColor = "tomato";
    }
    else if (pokemonData.weight = randData.weight) {
        attributes[7].textContent = `${((pokemonData.weight) / 10).toFixed(1)}kg`;
        attributes[7].style.backgroundColor = "lightgreen";

    }


}

