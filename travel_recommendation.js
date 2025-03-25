
const keywords = {
    beach: ["beach", "beaches"],
    temple: ["temple", "temples"],
    country: ["country", "countries"]
  };

  async function fetchData() {
    try {
      const response = await fetch('travel_recommendation_api.json');
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }

  async function performSearch() {
    const input = document.getElementById('searchInput').value.trim().toLowerCase();
    let results = [];

    const apiData = await fetchData();

    if (!apiData) {
      document.getElementById('search-result').innerHTML = "Error loading data";
      return;
    }

    if(keywords.country.includes(input)){
      apiData.countries.forEach(country => {
        if (country.name.toLowerCase().includes(input)) {
          results.push(`<h3>Country: ${country.name}</h3>`);
        }
        country.cities.forEach(city => {
            results.push(`
              <div class="card">
                <img src="${city.imageUrl}" alt="${city.name}" width="200">
                <div class="card-data">
                  <h3>${city.name}</h3>
                  <p>${city.description}</p>
                  <button>Visit</button>
                </div>
              </div>
            `);
        });
      });
    }
    else if(keywords.temple.includes(input)){
      apiData["temples"].forEach(temple => {
          results.push(`
            <div class="card">
              <img src="${temple.imageUrl}" alt="${temple.name}" width="200">
              <div class="card-data">
                <h3>${temple.name}</h3>
                <p>${temple.description}</p>
                <button>Visit</button>
              </div>
            </div>
          `);
      });
    }
    else if(keywords.beach.includes(input)){
      apiData.beaches.forEach(beach => {
          results.push(`
            <div class="card">
              <img src="${beach.imageUrl}" alt="${beach.name}" width="200">
              <div class="card-data">
                <h3>Beach: ${beach.name}</h3>
                <p>${beach.description}</p>
                <button>Visit</button>
              </div>
            </div>
          `);
      });
    }

    if (results.length > 0) {
      document.getElementById('search-result').innerHTML = results.join('');
    } else {
      document.getElementById('search-result').innerHTML = "No results found for: " + input;
    }
  }

function clearData(){
  document.getElementById('search-result').innerHTML = '';
}
