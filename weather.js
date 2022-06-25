const API_KEY ='ff532977349290d86ac2bc3243a8ca5a';

const time = new Date();
const year = time.getFullYear();
const month = time.getMonth();
const date = time.getDate();
const day = time.getDay();
const hour = time.getHours();
const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
const minutes = time.getMinutes();
const ampm = hour >=12 ? 'PM' : 'AM'

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


const bgkImg = document.getElementById('bgkImg');
const temperature = document.getElementById('temperature');
const hourweather = document.getElementById('weather_hour');
const currentTempEl = document.getElementById('current-temp');
const currentInfoImg = document.getElementById('current-info');
const otherweather_hour = document.getElementById('otherweather_hour');
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const otherWeather = document.getElementById('otherWeather');





setInterval(() => {
     timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`
    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month] + " , " + year;
}, 1100);

getWeatherData();
getWeatherCity();

function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        
        let {latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`)
            .then(res => res.json())
            .then(data => {
                console.log(data.hourly)
                showWeatherData(data);
            })
    })
}

function getWeatherCity()
{
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=hanoi&appid=${API_KEY}`)
    .then(res => res.json())
            .then(data => {
                console.log(data)
            });
}


function showWeatherData (data){
    let {humidity, pressure, sunrise, uvi,wind_speed,visibility} = data.current;

    
    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + "  "+data.lon+'E'

    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" +data.current.weather[0].description + "')";
    
     currentInfoImg.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" +data.current.weather[0].description + "')";

      bgkImg.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" +data.current.weather[0].description + "')";

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div><i class="fa-solid fa-droplet"></i> Humidity</div>
        <div>${humidity} %</div>
    </div>
    <div class="weather-item">
        <div><i class="fa-solid fa-down-left-and-up-right-to-center"></i> Pressure</div>
        <div>${pressure} hPa</div>
    </div>
    <div class="weather-item">
        <div><i class="fa-solid fa-wind"></i> Wind Speed</div>
        <div>${wind_speed} m/s</div>
    </div>
     <div class="weather-item">
        <div><i class="fas fa-sun"></i> Uvi</div>
        <div>${uvi} Uv</div>
    </div>
    <div class="weather-item">
        <div><i class="fas fa-eye"></i> Visibility</div>
        <div>${visibility/1000} km</div>
    </div>
    <div class="weather-item">
        <div><i class="fa-solid fa-mountain-sun"></i> Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
   
    `;

    let otherDayForcast = '';
    let otherWeatherItems = '';

    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <div class="img-today">
                <img src="http://openweathermap.org/img/wn//${data.current.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            </div>
            <div class="other">
                <div class="description">${data.current.weather[0].description}</div>
            </div>
            `;
            if(hour >= 12 && hour <= 24){
                temperature.innerHTML = `${(day.temp.night).toFixed(0)}&#176;C`;
            }
            else if(hour < 12 && hour > 0){
                temperature.innerHTML = `${(day.temp.day).toFixed(0)}&#176;C`;
            }
        }
        else{
            otherWeatherItems += `
                <div class="otherWeatherItem">
                <div class="day" >${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="description-daily">${data.daily[idx].weather[0].description}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div> 
                   <div class="others" id="current-weather-items">
                      <div class="weather-item">
                            <div><i class="fa-solid fa-droplet"></i> Humidity</div>
                            <div>${data.daily[idx].humidity}%</div>
                        </div>

                       <div class="weather-item">
                            <div><i class="fa-solid fa-down-left-and-up-right-to-center"></i> Pressure</div>
                            <div>${data.daily[idx].pressure}</div>
                        </div>

                       <div class="weather-item">
                            <div><i class="fa-solid fa-wind"></i> Wind Speed</div>
                            <div>${data.daily[idx].wind_speed}</div>
                        </div>
                        <div class="weather-item">
                            <div><i class="fas fa-sun"></i> Sunrise</div>
                            <div>${window.moment(data.daily[idx].sunrise * 1000).format('HH:mm a')}</div>
                        </div>
                        <div class="weather-item">
                            <div><i class="fas fa-moon"></i> Sunset</div>
                            <div>${window.moment(data.daily[idx].moonrise*1000).format('HH:mm a')}</div>
                        </div>
                    </div>
                </div>
            `;

            otherDayForcast += `
            <div class="weather-forecast-item" id="weather${idx}">
                <div class="day" >${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>    
            </div>
          `;
        }
    })

    let otherweather_hour = '';

    data.hourly.forEach((gio, idx) => {
        if(idx < 25 && idx > 0)
        {
            otherweather_hour += `
                <div class="otherWeatherHour">
                   <div class="weatherHourItem" id='weatherHourItem${idx}'> 
                        <div>${(idx + hour)>= 24 ? (idx + hour) %24: (idx + hour)}:00</div>
                        <div>${(data.hourly[idx].temp).toFixed(0)}&#176;C</div>
                        <div class="weatherHourItemIcon">
                            <img src="http://openweathermap.org/img/wn/${gio.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                            ${data.hourly[idx].weather[0].description}
                        </div>
                        <div>
                            <i class="fas fa-caret-down" id="down${idx}"></i>
                            <i class="fas fa-caret-up hide" id="up${idx}"></i>
                        </div>
                   </div>
                   <div class="weatherHourItemDetail" id="weatherHourItemDetail${idx}">
                         <div>
                           <div><i class="fa-solid fa-wind"></i> Wind Speed</div> 
                           <div>${(data.hourly[idx].wind_speed).toFixed(0)} m/s</div>
                        </div>
                        <div>
                            <div><i class="fas fa-sun"></i> Uvi</div>
                            <div>${data.hourly[idx].uvi} UV</div>
                        </div>
                        <div>
                            <div><i class="fas fa-cloud"></i> Cloud</div>
                            <div>${data.hourly[idx].clouds} %</div>
                        </div>
                        <div>
                            <div><i class="fa-solid fa-droplet"></i> Humidity</div>
                            <div>${data.hourly[idx].humidity} %</div>
                        </div>

                       <div>
                            <div><i class="fa-solid fa-down-left-and-up-right-to-center"></i> Pressure</div>
                            <div>${data.hourly[idx].pressure} hPa</div>
                        </div>
                    </div>
                </div>
                `;
            }   

             $(document).ready(function(){
                $("#weatherHourItem"+idx).click(function(){
                    $("#weatherHourItemDetail"+idx).slideToggle(300);
                    $("#up"+idx).toggle();
                    $("#down"+idx).toggle();
                  });
            });   
    });

    hourweather.innerHTML = otherweather_hour;
    weatherForecastEl.innerHTML = otherDayForcast;   
    otherWeather.innerHTML = otherWeatherItems; 
};

/*----------------------------------------------------------------------*/
    var modal = document.querySelector(".modal");
    var mybtn = document.getElementById('mybtn');
    var futureForecast = document.querySelector(".future-forecast");

    mybtn.addEventListener('click', () => {
            modal.classList.toggle("hide");
            futureForecast.classList.toggle("hide");
        });


       
    
   
 


    


