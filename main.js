// define variables //
const input = document.querySelector('.input')
const search = document.querySelector('.btn')
const  mainIcon = document.querySelector('.weather-icon')
const cityname = document.querySelector('.city') 
const hightemp = document.querySelector('.high')
const lowtemp = document.querySelector('.low')
const description = document.querySelector('.desc')
const days = document.querySelectorAll('.weekday')
const icons = document.querySelectorAll('.icon')
const temps = document.querySelectorAll('.temp')
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
// add a listener to the button to fetch the api's and then display the contents //
search.addEventListener('click', ()=>{
  if (input.value.trim() == '')return
  // input api url's //
  const forecasturl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(input.value)}&appid=${apikey}&units=metric`
const weatherurl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(input.value)}&appid=${apikey}&units=metric`;
  // fetch api //
Promise.all([fetch(forecasturl).then(handleres), fetch(weatherurl).then(handleres)])
  // handle errors //
  .then(([foredata,weatherdata]) => {
    if (Number(foredata.cod) !== 200) {
      throw new Error(foredata.message || "City not found!");
    }
    if (Number(weatherdata.cod) !== 200) {
  throw new Error(weatherdata.message || "City not found!");
}
   // append details to the html using dom manipulation //
  const imgcode = weatherdata.weather[0].icon
  mainIcon.setAttribute('src',`https://openweathermap.org/img/wn/${imgcode}@2x.png`)
   cityname.textContent = weatherdata.name
   hightemp.textContent = `High: ${weatherdata.main.temp_max}°C`
   lowtemp.textContent = `Low: ${weatherdata.main.temp_min}°C`
   description.textContent = weatherdata.weather[0].description
    // loop through the days to input the details for the days, icons and temps at once //
   days.forEach((day,index) =>{
   let num = index  
    num++
    let data = foredata.list[num * 8]
    let icon = data.weather[0].icon
    day.textContent = new Date(data.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
    icons[index].setAttribute('src',`https://openweathermap.org/img/wn/${icon}@2x.png`)
    temps[index].textContent = `${data.main.temp}°C`
   })
   // display the containers //
   forecastbox.style.display = 'grid'
   weatherCard.style.display = 'block'
  })
})