
let data = {};

async function fetchData() {
    try {
        const res = await fetch("travel_recommendation_api.json");
        data = await res.json();
        console.log("DATA:", data);
    } catch (err) {
        console.log(err);
    }
}

fetchData();
function getKeyword(input) {
    input = input.toLowerCase();

    if (input.includes("beach")) return "beach";
    if (input.includes("temple")) return "temple";
    if (input.includes("country")) return "country";

    return null;
}

function normalize(word) {
    word = word.toLowerCase().trim();

    if (word.includes("beach")) return "beaches";
    if (word.includes("temple")) return "temples";
    if (word.includes("country")) return "countries";

    return word;
}

function search() {
    const inputEl = document.getElementById("searchInput");
    const resultsDiv = document.getElementById("results");

    if (!inputEl || !resultsDiv) return;

    let input = inputEl.value.toLowerCase().trim();

    if (!input) {
        resultsDiv.innerHTML = "<p>Type something to search</p>";
        return;
    }

    let results = [];

    // 🔥 DIRECT CATEGORY MATCH (this is the real fix)
    if (input.includes("temple")) {
        results = data.temples || [];
    } 
    else if (input.includes("beach")) {
        results = data.beaches || [];
    } 
    else if (input.includes("country")) {
        if (data.countries) {
            data.countries.forEach(country => {
                if (country.cities) {
                    results.push(...country.cities);
                }
            });
        }
    } 
    else {
        // 🔍 normal search (ANY word)
        Object.values(data).forEach(category => {
            if (!Array.isArray(category)) return;

            category.forEach(item => {

                if (
                    item.name?.toLowerCase().includes(input) ||
                    item.description?.toLowerCase().includes(input)
                ) {
                    results.push(item);
                }

                if (item.cities) {
                    item.cities.forEach(city => {
                        if (
                            city.name.toLowerCase().includes(input) ||
                            city.description.toLowerCase().includes(input)
                        ) {
                            results.push(city);
                        }
                    });
                }

            });
        });
    }

    // remove duplicates
    results = [...new Map(results.map(item => [item.name, item])).values()];

    if (results.length === 0) {
        resultsDiv.innerHTML = "<p>No results found</p>";
        return;
    }

    resultsDiv.style.display = "grid";
    resultsDiv.style.gridTemplateColumns = "repeat(auto-fit, minmax(250px, 1fr))";
    resultsDiv.style.gap = "20px";

    resultsDiv.innerHTML = results.slice(0, 6).map(place => `
        <div class="card">
            <h3>${place.name}</h3>
            <img src="https://picsum.photos/400/300?random=${encodeURIComponent(place.name)}">
            <p>${place.description}</p>
        </div>
    `).join("");
}

function clearSearch() {
    const inputEl = document.getElementById("searchInput");
    const resultsDiv = document.getElementById("results");

    if (inputEl) inputEl.value = "";
    if (resultsDiv) resultsDiv.innerHTML = "";
}
