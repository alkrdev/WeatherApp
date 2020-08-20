import React from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { API_KEY } from "./src/components/Setup"

import Home from "./src/Home";
import International from "./src/International";

const Stack = createStackNavigator();

const App = () => {
  // Hooks, at highest level, has main data and "locations", can be made available throughout all components
  const [data, setData] = React.useState({})
  const [forecast, setForecast] = React.useState({})
  const [loading, setLoading] = React.useState(true)
  const [locations, setLocations] = React.useState([])

  // Uses AsyncStorage to get currently set "locations" in localstorage (persistent data)
  const StoreLocations = async () => {
    try {
      await AsyncStorage.setItem('locations', JSON.stringify(locations));
    } catch (error) {
      console.log(error)
      // Error saving data
    }
  };
  
  const GetLocations = async () => {
    try {
      const value = await AsyncStorage.getItem('locations');
      if (value !== null) {
        var values = JSON.parse(value)
        var ids = values.map(x => x.id)
        if (ids.length !== 0) {
          var url = `http://api.openweathermap.org/data/2.5/group?id=${ids.join()}&appid=${API_KEY}&units=metric`
        
          fetch(url)
            .then(res => res.json())
            .then(json => {          
              setLocations(json.list.map(loc => ({                 
                name: loc.name,
                weather: loc.weather,
                temperature: loc.main.temp,
                id: loc.id                
              })))
            })
        }        
      }
    } catch (error) {
      console.log(error)
      // Error retrieving data
    }
  };

  React.useEffect(() => {
    GetLocations()
    navigator.geolocation.getCurrentPosition(position => {
      var lat = position.coords.latitude
      var lon = position.coords.longitude
      var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

      fetch(url)
        .then(res => res.json())
        .then(json => {
          var current = { 
            timezone: json.timezone,
            sunrise: json.current.sunrise,
            sunset: json.current.sunset, 
            initialdatetime: json.current.dt,
            temperature: json.current.temp,
            weather: json.current.weather[0]
          }
          var forecast = json.daily.slice(1, 6)

          setData(current)
          setForecast(forecast)
          setLoading(false)
        })
    })
  }, [])

  React.useEffect(() => {
    StoreLocations()
  }, [locations])

  // "Onyx" background color
  const WeatherAppTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#303633'
    },
  };

  return (
    <NavigationContainer theme={WeatherAppTheme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" options={customHeader}>
          {props => loading ? <></> : <Home {...props} data={data} forecast={forecast}/>}
        </Stack.Screen>
        <Stack.Screen name="International" options={customHeader}>
          {props => <International {...props} locations={locations} setLocations={setLocations} StoreLocations={StoreLocations} GetLocations={GetLocations} />}
        </Stack.Screen> 
      </Stack.Navigator>
    </NavigationContainer>   
  );
}

const customHeader = { 
  headerTitleAlign: "center", 
  headerStyle: { backgroundColor: '#303633' }, 
  headerTintColor: "#fff" 
}

export default App;
