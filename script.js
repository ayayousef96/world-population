const regionBtn = document.getElementById('buttons');
const countryBtn =document.getElementById('countries');
let WorldData = {America:[],Asia :[],Africa:[], Europe:[], Oceania:[]};


var welcome = document.querySelector('.welcome');
document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(() =>{
    welcome.classList.add('display-none')
  },1200)

})


//helper function for data fetxh
async function Fetch(url){
    try {
        const result = await fetch(url);
        const data = await result.json();
        return data;
    } 
    catch (error) {
        console.log("Error occured while fetching data!");
    }
};




async function fetchCountryData(){
    for(continent in WorldData){
        console.log(WorldData[continent]);
        const Region = await Fetch(`https://restcountries.com/v3.1/region/${continent}`);
        Region.forEach((r) =>{
            const countryPopulation = r.population;
            const countryName = r.name.common;
            WorldData[continent].push({country:countryName,population:countryPopulation});

        })
        
    }


}

const ftchCountryCities= async (country) => {
    try {
        const result = await fetch('https://countriesnow.space/api/v0.1/countries/population/cities/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'limit': 40,
                'orderBy': "population",
                'order': "dsc",
                'country': country,
            }),
        });
        const data = await result.json();
        return data;
    }
    catch (error) {
        console.log("Error occured while fetching data!");
    }
};

fetchCountryData();
const countriesBtns= document.getElementById("countries");


function SetCountriesBtns(curr_region_arr){
    countriesBtns.innerHTML='';
    curr_region_arr.forEach((el) => {
        const button = document.createElement('button');
        button.textContent = el.country;
        countriesBtns.appendChild(button);
    });
}





function handle_continent_btns(event){
    curr_region_arr=WorldData[event.target.textContent];
    SetCountriesBtns(curr_region_arr);
    const colors_by_region={America:'blue',Asia :'lightyellow',Africa:'green', Europe:'pink', Oceania:'gray'}
    const labels = WorldData[event.target.textContent].map(el => el.country);
    const population = WorldData[event.target.textContent].map(el => el.population);
    let color=colors_by_region[event.target.textContent]
    BulidChart(labels,population,color);
}

async function handle_country_btn(event){
    let res = await fetchDataForcountry(event.target.textContent);
    //console.log(res);
    if (res.data) {
        const labels = res.data.map((el) => {
            return el.city
        });
        const population = res.data.map((el) => {
            return el.populationCounts[0].value
        });
        BulidChart(labels,population,"pink");
        return;
    }

}

// regionBtn.addEventListener('click',handle_continent_btns);
// countryBtn.addEventListener('click',handle_country_btn);

Chart.defaults.color='white';
function BulidChart(labels, cur_data,color) {
    const curentChart = document.getElementById('myChart');
    const myChart = new Chart(curentChart, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'population',
                data: cur_data,
                backgroundColor: color,
                
                
            }]
        },
        Option: {
            
        }
    });
};

function set_all_btns(){
    regionBtn.addEventListener('click',handle_continent_btns);
    countryBtn.addEventListener('click',handle_country_btn);
}

set_all_btns();
