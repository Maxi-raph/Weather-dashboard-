// define variables //
const input = document.querySelector('.input')
const search = document.querySelector('.btn')
const forecastbox = document.querySelector('.forecast')
const weatherCard = document.querySelector('.weather-card')
const apikey = '069ae01f7f8a77b2db2e1fea01356b1f'

// handle error for the fetch api before returning json //
function handleres(res) {
  if (!res.ok) {
    throw new Error(`http error: ${res.status}`)
  }
 return res.json()
}
// set the display of the containers to none if there's no input value //
input.addEventListener('input', () =>{
  if (input.value == ''){
  forecastbox.style.display = 'none'
  weatherCard.style.display = 'none'
  }
})
let currentRequest = 0
// add a listener to the button to fetch the api's and then display the contents //

search.addEventListener('click', ()=>{
  if (input.value.trim() === '')return
  // clear any previous api call content //
  forecastbox.innerHTML = ''
  weatherCard.innerHTML = ''
  let requestId = ++currentRequest
  console.log(currentRequest,requestId)
  // input api url's //
  const forecasturl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(input.value)}&appid=${apikey}&units=metric`
const weatherurl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(input.value)}&appid=${apikey}&units=metric`;
  // fetch api //
Promise.all([fetch(forecasturl).then(handleres), fetch(weatherurl).then(handleres)])
  // handle errors //
  .then(([foredata,weatherdata]) => {
    if (requestId !== currentRequest)return
    if (Number(foredata.cod) !== 200) {
      throw new Error(foredata.message || "City not found!");
    }
    if (Number(weatherdata.cod) !== 200) {
  throw new Error(weatherdata.message || "City not found!");
}
   // append details to the html using dom manipulation //
   const imgcode = weatherdata.weather[0].icon
   let section = document.createElement('section')
    section.className = 'current-weather'
    section.innerHTML = `
    <img class="weather-icon" src="https://openweathermap.org/img/wn/${imgcode}@2x.png" alt="img">
       <div class="info">
         <h2 class="city">${weatherdata.name}</h2>
         <div class="temp-flex">
           <p class="high">High: ${weatherdata.main.temp_max}°C</p>
           <p class="low">Low: ${weatherdata.main.temp_min}°C</p>
         </div>
         <p class="desc">${weatherdata.weather[0].description}</p>
       </div>
    `
    weatherCard.appendChild(section)
    // loop through the days to input the details for the days, icons and temps at once //
    foredata.list.forEach((data,i)=>{
      if (i == 8 || i == 16 || i == 24 || i == 32) {
  let icon = data.weather[0].icon
let day = document.createElement('div')
day.className = 'day'
day.innerHTML = `
        <p class="weekday">${new Date(data.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</p>
         <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="" class="icon" />
         <p class="temp">${data.main.temp}°C</p>
        `
        forecastbox.appendChild(day)
      }
      
    })
   // display the containers //
   forecastbox.style.display = 'grid'
   weatherCard.style.display = 'block'
  })
})