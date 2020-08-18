import React from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { API_KEY } from "./src/Setup"

import Home from "./src/components/Home";
import International from "./src/components/International";

const Stack = createStackNavigator();

const App = () => {
  const [data, setData] = React.useState({})
  const [forecast, setForecast] = React.useState({})
  const [loading, setLoading] = React.useState(true)
  const [locations, setLocations] = React.useState([])



  const StoreLocations = async () => {
    try {
      console.log("FROM STORELOCATIONS: " + locations)
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
        setLocations(values)
        console.log("FROM GETLOCATIONS: " + values)
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
            temperature: json.current.temp 
          }
          var forecast = json.daily.slice(1, 6)

          // console.log(new Date(forecast.dt * 1000).toLocaleTimeString())

          setData(current)
          setForecast(forecast)
          setLoading(false)
        })
    })
  }, [])

  React.useEffect(() => {
    StoreLocations()
  }, [locations])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" options={{ headerTitleAlign: "center" }}>
          {props => <Home {...props} data={data} forecast={forecast} loading={loading}/>}
        </Stack.Screen>
        <Stack.Screen name="International" options={{ headerTitleAlign: "center" }}>
          {props => <International {...props} locations={locations} setLocations={setLocations} StoreLocations={StoreLocations} GetLocations={GetLocations} />}
        </Stack.Screen> 
      </Stack.Navigator>
    </NavigationContainer>   
  );
}

export default App;
