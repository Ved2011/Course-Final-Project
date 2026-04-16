
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

function search() {
    const inputEl = document.getElementById("searchInput");
    const resultsDiv = document.getElementById("results");

    if (!inputEl || !resultsDiv) return;

    const input = inputEl.value.toLowerCase().trim();

    if (!input) {
        resultsDiv.innerHTML = "<p>Type something to search</p>";
        return;
    }

    let results = [];

    Object.keys(data).forEach(key => {
        const category = data[key];

        if (!Array.isArray(category)) return;

        category.forEach(item => {

            // ✅ CATEGORY MATCH (this fixes "beach")
            if (key.toLowerCase().includes(input)) {
                results.push(item);
            }

            // ✅ NORMAL MATCH
            if (item.name && item.description) {
                if (
                    item.name.toLowerCase().includes(input) ||
                    item.description.toLowerCase().includes(input)
                ) {
                    results.push(item);
                }
            }

            // ✅ NESTED CITIES
            if (item.cities && Array.isArray(item.cities)) {
                item.cities.forEach(city => {
                    if (
                        city.name.toLowerCase().includes(input) ||
                        city.description.toLowerCase().includes(input) ||
                        key.toLowerCase().includes(input)
                    ) {
                        results.push(city);
                    }
                });
            }

        });
    });

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
