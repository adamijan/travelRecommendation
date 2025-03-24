document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('searchKey').value;
    loadContainer(query);
});

document.getElementById('reset-btn').addEventListener('click', () => {
    document.getElementById('data-container').innerHTML = '';
    document.getElementById('searchKey').value = '';
});


async function loadContainer(query = '') {
    const response = await fetch('./travel_recommendation_api.json'); 
    const data = await response.json();

    const fetchedData = query ? getRecommData(data, query) : data;
    presentRecommData(fetchedData);
}

function getRecommData(data, query) {
    query = query.toLowerCase();
    const fetchedData = {
        countries: [],
        temples: [],
        beaches: []
    };

    const searchKeys = {
        countries: ["country", "countries"],
        temples: ["temple", "temples"],
        beaches: ["beach", "beaches"]
    };

    let matchFlag = false;

    Object.keys(searchKeys).forEach(category => {
        if (searchKeys[category].includes(query)) {
            fetchedData[category] = data[category];
            matchFlag = true;
        }
    });

    if (!matchFlag) {
        data['countries'].forEach(country => {
            if (country.name.toLowerCase().includes(query)) {
                fetchedData.countries.push(country); 
            } else {
                const matchingCities = country.cities.filter(city => 
                    city.name.toLowerCase().includes(query)
                );
                if (matchingCities.length > 0) {
                    fetchedData.countries.push({ ...country, cities: matchingCities });
                }
            }
        });

        fetchedData['temples'] = data['temples'].filter(temple => 
            temple.name.toLowerCase().includes(query)
        );
        fetchedData['beaches'] = data['beaches'].filter(beach => 
            beach.name.toLowerCase().includes(query)
        );
    }

    return fetchedData;
}

function presentRecommData(data) {
    const container = document.getElementById('data-container');
    container.innerHTML = '';

    data['countries'].forEach(country => {
        country.cities.forEach(city => {
            const card = createCard(city);
            container.appendChild(card);
        });
    });

    data['temples'].forEach(temple => {
        const card = createCard(temple);
        container.appendChild(card);
    });

    data['beaches'].forEach(beach => {
        const card = createCard(beach);
        container.appendChild(card);
    });
}



function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';

    const image = document.createElement('img');
    image.src = item.imageUrl;
    image.alt = `Image of ${item.name}`;

    const name = document.createElement('h3');
    name.textContent = item.name;

    const description = document.createElement('p');
    description.textContent = item.description;

    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(description);

    return card;
}
