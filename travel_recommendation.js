const keywords = {
    beach: ["beach", "beaches", "BEACH"],
    temple: ["temple", "temples", "TEMPLE"],
    country: ["country", "countries", "COUNTRY"]
  };

  async function searchSuggests() {

    const searchword = document.getElementById('searchInput').value.trim().toLowerCase();

    let resultArray = [];

    const jsonData = await getJsonData();

    if (!jsonData) {
      document.getElementById('suggest-data').innerHTML = "Error loading data";
      return;
    }

    if(keywords.country.includes(searchword)){
      jsonData.countries.forEach(country => {
        if (country.name.toLowerCase().includes(searchword)) {
          resultArray.push(`<h3>Country: ${country.name}</h3>`);
        }
        country.cities.forEach(city => {
            resultArray.push(`
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
    else if(keywords.temple.includes(searchword)){
      jsonData.temples.forEach(temple => {
        resultArray.push(`
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
    else if(keywords.beach.includes(searchword)){
      jsonData.beaches.forEach(beach => {
        resultArray.push(`
            <div class="card">
              <img src="${beach.imageUrl}" alt="${beach.name}" width="200">
              <div class="card-data">
                <h3>${beach.name}</h3>
                <p>${beach.description}</p>
                <button>Visit</button>
              </div>
            </div>
          `);
      });
    }

    if (resultArray.length > 0) {
      document.getElementById('suggest-data').innerHTML = resultArray.join('');
    } else {
      document.getElementById('suggest-data').innerHTML = "No results found for: " + searchword;
    }
  }

  async function getJsonData() {
    try {
      const response = await fetch('travel_recommendation_api.json');
      if (!response.ok) {
        throw new Error("Json API not responding");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data from Json file:', error);
      return null;
    }
  }

function clearSuggests(){
  document.getElementById('suggest-data').innerHTML = '';
  document.getElementById('searchInput').value = '';
}
