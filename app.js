console.log("This is working!");
function attachEvents() {
    
    let weatherBtn = document.getElementById("submit");//button
    let symbol;//create variable to use later  

    weatherBtn.addEventListener("click", async function() {//event listener attached to the button
        var requestOptions = {
        method: 'GET',
        redirect: 'follow'
        };

        let locationField = document.getElementById("location").value;//this is the input field
        let showDisplay = document.getElementById("forecast").style.display = "block";//initially the display is set to "none". if button is pressed, enable it.
        let forecast = document.getElementsByClassName("label");//where forecast will be displayed
        //THIS IS THE TOP, SINGLE WEATHER RESULT
        fetch("https://judgetests.firebaseio.com/locations.json", requestOptions)
        .then((response) => {
        if(response.status == 200 && locationField == "ny" || locationField == "london" || locationField == "barcelona"){//location key(code of object)
            return response.json();//get the json object
        }else {
            throw Error(response.statusText,locationField);
        }
        })
        .then(result => {
            // console.log(result)
            for(let report in result){
                if(result[report].code == locationField){//object code is ny, london, barcelona
                    let code = result[report].code;
                    // let url = `https://judgetests.firebaseio.com/forecast/today/${code}.json`;
                    console.log("match");
                    fetch(`https://judgetests.firebaseio.com/forecast/today/${code}.json`)
                    .then(response => response.json())
                    .then(result => {
                            
                        for(let forecastInfo in result){
                            let weather = result[forecastInfo].condition;//drill down into object to get the condition

                            switch(weather){//iterate over condition codes
                                case "Sunny":
                                    symbol = '&#x2600';// ☀
                                break;
                                case "Partly sunny":
                                    symbol = '&#x26C5';// ⛅
                                break;
                                case "Overcast":
                                    symbol = '&#x2601'; // ☁
                                break;
                                case "Rain":
                                    symbol = '&#x2614';// ☂
                                break;
                            }
                        }

                    let degreesSymbol = '&#176'; // °
                    let current = document.getElementById("current");
                    let currentForecast = document.createElement("div");//create a div to display the current day forecast of object
                    currentForecast.innerHTML = `
                    <span class="condtion symbol">${symbol}</span>
                    <span class="condition">
                    <span class="forecast-data">${result.name}</span>
                    <span class="forecast-data">${result.forecast.low}${degreesSymbol}/${result.forecast.high}${degreesSymbol}</span>
                    <span class="forecast-data">${result.forecast.condition}</span>
                    </span>`;
                    current.appendChild(currentForecast);//append the created div to the DOM
                    })
                    .catch((error) => {
                        forecast.textContent = `Error`;//catch error                    
                    });  

                    //this is for the bottom row - 3 day forecast...
                    fetch(`https://judgetests.firebaseio.com/forecast/upcoming/${code}.json`)
                    .then(response => response.json())
                    .then(result => { 
                    let resultArr = Object.entries(result);//turn object into array so we can index it
                    let days = resultArr[0][1];//get the 3 day condition w/ highs & lows
                    // console.log(days)
                    let upcoming = document.getElementById("upcoming");//this gets the 3 day div                    
                    let forecastInfoDiv = document.createElement("div");//create div so we can append our results to the DOM
                    forecastInfoDiv.className = "forecast-info";
                    upcoming.appendChild(forecastInfoDiv);//append our div to the DOM

                    let spanDiv = document.createElement("span");//create a span element
                    spanDiv.className = "upcoming";
                    forecastInfoDiv.appendChild(spanDiv);//append our span to the DOM

                    let str = "";
                    for(let day in days){

                        let forecastCond = days[day].condition;//this is the codition for the 3 day
                        
                        switch(forecastCond){
                            case "Sunny":
                                symbol = '&#x2600';
                            break;
                            case "Partly sunny":
                                symbol = '&#x26C5';
                            break;
                            case "Overcast":
                                symbol = '&#x2601';
                            break;
                            case "Rain":
                                symbol = '&#x2614';
                            break;
                        }
                        //as it loops we create the format to append to the DOM shown as the 3 day results
                        let degreesSymbol = '&#176'; // °
                        str += `<span class="upcoming">
                        <span class="symbol">${symbol}</span>                            
                        <forecast-data class="forecast-data">${days[day].low}${degreesSymbol}/${days[day].high}${degreesSymbol}</forecast-data>
                        <span class="forecast-data">${days[day].condition}</span></span>
                        </span>`;
                    }
                    spanDiv.innerHTML = str;
                    }); 
                }
            }            
        })//then
        .catch((error) => {
            let forecast = document.getElementById("current");//get div to throw error
            let contentBox = document.getElementById("content");
            forecast.style.backgroundColor = "#d71a1a";//change background color if error is thrown. This is extra, not in directions
            forecast.style.color = "white";
            contentBox.style.width = "45%";
            forecast.textContent = `Error!`;//print error on the screen                   
        }); //then
    });//event listener
}//function
attachEvents(); 