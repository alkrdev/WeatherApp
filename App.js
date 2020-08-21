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

  // Uses AsyncStorage to store the current set of "Locations"
  // Stringified because AsyncStorage only allows saving of a string
  const StoreLocations = async () => {
    try {
      await AsyncStorage.setItem('locations', JSON.stringify(locations));
    } catch (error) {
      console.log(error)
      // Error saving data
    }
  };
  
  
  // Uses AsyncStorage to get currently set "locations" in localstorage (persistent data)
  // Parsed from a JSONString, due to string limitation, see above.
  const GetLocations = async () => {
    try {
      const value = await AsyncStorage.getItem('locations');
      if (value !== null) {
        var values = JSON.parse(value)

        // Maps a new array, taking only the ID's of the current locations
        var ids = values.map(x => x.id)

        // If there are any ID's
        if (ids.length !== 0) {
          var url = `http://api.openweathermap.org/data/2.5/group?id=${ids.join()}&appid=${API_KEY}&units=metric`
        
          fetch(url)
            .then(res => res.json())
            .then(json => {         
              // New data (temperature), making sure "Locations" is up-to-date 
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

  // useEffect setup with an empty DependencyArray, so it will only run once on render (and once every re-render)
  React.useEffect(() => {
    // Run GetLocations to renew data from API
    GetLocations()

    // Get current geolocation of device
    navigator.geolocation.getCurrentPosition(position => {
      var lat = position.coords.latitude
      var lon = position.coords.longitude
      var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

      fetch(url)
        .then(res => res.json())
        .then(json => {
          // Create object with data from API call
          var current = { 
            timezone: json.timezone,
            sunrise: json.current.sunrise,
            sunset: json.current.sunset, 
            initialdatetime: json.current.dt,
            temperature: json.current.temp,
            weather: json.current.weather[0]
          }

          // Get forecast of the NEXT 5 days, skipping the first and remaining days
          var forecast = json.daily.slice(1, 6)

          setData(current)
          setForecast(forecast)

          // Data has been loaded, so we're no longer loading
          setLoading(false)
        })
    })
  }, [])

  // useEffect setup with "locations" as a dependency, making sure 
  // StoreLocations() will run whenever "locations" changes
  // Effectively constantly makes sure our persistent data is up-to-date
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
    // Theme applied to entire app (Across screen)
    <NavigationContainer theme={WeatherAppTheme}>
      {/* Start on screen called "Home" */}
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" options={customHeader}>
          {/* Home requires knowledge of current data and forecast */}
          {props => loading ? <></> : <Home {...props} data={data} forecast={forecast}/>}
        </Stack.Screen>
        <Stack.Screen name="International" options={customHeader}>
          {/* International requires knowledge of saved locations, and the ability to change them */}
          {props => <International {...props} locations={locations} setLocations={setLocations} GetLocations={GetLocations} />}
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
