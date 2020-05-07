import React from 'react';
import './App.css';
import Weather from './app-component/weather.component'
import "bootstrap/dist/css/bootstrap.min.css";
import "weather-icons/css/weather-icons.css";
import Form from './app-component/form.component'

//api call api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
const API_key="616c6bea448a32f52d8298e3fdc71d77"

class App extends React.Component{
  
  constructor(props) {
    super(props)
  
    this.state = {
       city:undefined,
       country:undefined,
       icon:undefined,
       main:undefined,
       temp_celsius:undefined,
       temp_max:undefined,
       temp_min:undefined,
       description:'',
       error:false
    }

    this.weatherIcon={
      Thunderstorm:"wi-thunderstorm",
      Drizzle:"wi-sleet",
      Rain:"wi-storm-showers",
      Snow:"wi-snow",
      Atmosphere:"wi-fog",
      Clear:"wi-day-sunny",
      Clouds:"wi-day-fog"
    };
  }
  
  getWeather=async(event) =>{
    
    event.preventDefault(); 
    const city=event.target.elements.city.value;
    const country=event.target.elements.country.value;

    if(city && country){
      const api_call=await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_key}`)
    
    const response=await api_call.json();
    
    console.log(response);
  
    this.setState({
      city:`${response.name},${response.sys.country}`,
      temp_celsius:this.calCelsius(response.main.temp),
      temp_max:this.calCelsius(response.main.temp_max),
      temp_min:this.calCelsius(response.main.temp_min),
      description:response.weather[0].description,
      error:false
    })
    this.get_WeatherIcon(this.weatherIcon,response.weather[0].id)
    }else{
      this.setState({error:true})
    }
  }

  calCelsius(temp){
    return Math.floor(temp-273.15);
  }

  get_WeatherIcon(icons,rangeId){
    switch(true){
      case rangeId >=200 && rangeId<=232:
        this.setState({icon:this.weatherIcon.Thunderstorm});
        break;
      
      case rangeId >=300 && rangeId<=321:
        this.setState({icon:this.weatherIcon.Drizzle});
        break;

      case rangeId >=500 && rangeId<=532:
        this.setState({icon:this.weatherIcon.Rain});
        break;
      
      case rangeId >=600 && rangeId<=622:
        this.setState({icon:this.weatherIcon.Snow});
        break;
    
      case rangeId >=701 && rangeId<=781:
        this.setState({icon:this.weatherIcon.Atmosphere});
        break;    
       
      case rangeId ===800:
        this.setState({icon:this.weatherIcon.Clear});
        break; 
      
      case rangeId >=801 && rangeId<=804:
        this.setState({icon:this.weatherIcon.Clouds});
        break;  

      default:
        this.setState({icon:this.weatherIcon.Clouds});
    }

  }
  
  render(){
    return(
      <div className="App">

        <Form loadweather={this.getWeather} error={this.state.error}/>

        <Weather
           city={this.state.city}
           country={this.state.country}
           temp_celsius={this.state.temp_celsius}
           temp_max={this.state.temp_max}
           temp_min={this.state.temp_min}
           description={this.state.description}
           weatherIcon={this.state.icon}
        />

      </div>
    )
  };
}

export default App;
