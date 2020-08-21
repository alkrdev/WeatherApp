import React from "react";
import { API_KEY , Text} from "./components/Setup"
import { View, TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import LocationsList from "./components/international/LocationsList"

const International = ({locations, setLocations, GetLocations}) => {
    // Hooks, Text is used for TextInput
    const [text, setText] = React.useState("");

    // Run Fetch (Async) on OpenWeatherMap API, based on what city was entered in the TextInput
    const AddLocation = () => {
        var url = `http://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${API_KEY}&units=metric`;
        fetch(url)
            .then(res => res.json())
            .then(json => {
                // Check if response "Is not an error" (404), and check if location already exists
                if (json.cod !== "404" && !locations.some(x => x.id === json.id)) {
                    // Spread syntax to mimic "Array.prototype.push()"
                    setLocations(locations => [...locations, {
                        name: json.name,
                        weather: json.weather,
                        temperature: json.main.temp,
                        id: json.id
                    }])                
                }            
            })
    }

    // useEffect setup with an empty DependencyArray, so it will only run once on render (and once every re-render)
    React.useEffect(() => {
        GetLocations()
    }, [])

    return (
        <View>
            <TextInput onChangeText={x => setText(x)} text={text} style={input} placeholder="Enter the name of a city" />

            <TouchableOpacity style={add} onPress={AddLocation}>
                <Text style={{fontSize: 30}}>Add Location</Text>
            </TouchableOpacity>
            
            <LocationsList locations={locations} setLocations={setLocations}/>
        </View>

    )
}

const input = {
    height: 70, 
    borderColor: "#AD8350", 
    borderWidth: 4, 
    padding: 7, 
    fontSize: 30,
    color: "#fff"
}

const add = {
    alignItems: "center",
    backgroundColor: "#AD8350",
    padding: 10
}

export default International;