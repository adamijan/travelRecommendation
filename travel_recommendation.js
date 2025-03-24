document.getElementById('search-btn').addEventListener('click', () => {
    const request = document.getElementById('searchKey').value;
    loadContainer(request);
});

document.getElementById('reset-btn').addEventListener('click', () => {
    document.getElementById('data-container').innerHTML = '';
    document.getElementById('searchKey').value = '';
});


async function loadContainer(request = '') {
    const reply = await fetch('./travel_recommendation_api.json'); 
    const data = await reply.json();

    const fetchedData = request ? getRecommData(data, request) : data;
    presentRecommData(fetchedData);
}

function getRecommData(data, request) {
    request = request.toLowerCase();
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
        if (searchKeys[category].includes(request)) {
            fetchedData[category] = data[category];
            matchFlag = true;
        }
    });

    if (!matchFlag) {
        data['countries'].forEach(country => {
            if (country.name.toLowerCase().includes(request)) {
                fetchedData.countries.push(country); 
            } else {
                const matchingCities = country.cities.filter(city => 
                    city.name.toLowerCase().includes(request)
                );
                if (matchingCities.length > 0) {
                    fetchedData.countries.push({ ...country, cities: matchingCities });
                }
            }
        });

        fetchedData['temples'] = data['temples'].filter(temple => 
            temple.name.toLowerCase().includes(request)
        );
        fetchedData['beaches'] = data['beaches'].filter(beach => 
            beach.name.toLowerCase().includes(request)
        );
    }

    return fetchedData;
}

function presentRecommData(data) {
    const container = document.getElementById('data-container');
    container.innerHTML = '';

    data['countries'].forEach(country => {
        country.cities.forEach(city => {
            const suggest = createSuggest(city);
            container.appendChild(suggest);
        });
    });

    data['temples'].forEach(temple => {
        const suggest = createSuggest(temple);
        container.appendChild(suggest);
    });

    data['beaches'].forEach(beach => {
        const suggest = createSuggest(beach);
        container.appendChild(suggest);
    });
}



function createSuggest(item) {
    const suggest = document.createElement('div');
    suggest.className = 'suggest';

    const image = document.createElement('img');
    image.src = item.imageUrl;
    image.alt = `Image of ${item.name}`;

    const name = document.createElement('h3');
    name.textContent = item.name;

    const description = document.createElement('p');
    description.textContent = item.description;

    suggest.appendChild(image);
    suggest.appendChild(name);
    suggest.appendChild(description);

    return suggest;
}
