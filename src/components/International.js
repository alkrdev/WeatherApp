import React from "react";
import { API_KEY , Text} from "../Setup"
import { View, TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const International = ({locations, setLocations, GetLocations, StoreLocations}) => {
    const [text, setText] = React.useState("");

    const AddLocation = () => {
        var url = `http://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${API_KEY}&units=metric`;
        fetch(url)
            .then(res => res.json())
            .then(json => {
                if (json.cod !== "404") {
                    var obj = {
                        name: json.name,
                        weather: json.weather,
                        temperature: json.main.temp,
                        id: json.id
                    }

                    if (!locations.some(x => x.id === obj.id)) {
                        setLocations(locations => [...locations, obj])
                    }
                }            
            })
    }
       
    

    React.useEffect(() => {
        GetLocations()
    }, [])

    return (
        <View>
            <TextInput onChangeText={input => setText(input)} text={text}
                style={{height: 70, borderColor: "gray", borderWidth: 2, padding: 5, fontSize: 30}}
                placeholder="Enter the name of a city"></TextInput>
            <TouchableOpacity style={{
                alignItems: "center",
                backgroundColor: "#DDDDDD",
                padding: 10
            }} onPress={AddLocation}>
                <Text style={{fontSize: 30}}>Add Location</Text>
            </TouchableOpacity>
            {locations.map(x => {
                return <View key={x.id} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                    <Text style={{ marginLeft: 20}}>{x.name}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text>{x.temperature}°C</Text>
                        <TouchableOpacity style={{
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#DDDDDD",
                            width: 70,
                            height: 50,
                            marginLeft: 10,
                            marginRight: 20
                        }} onPress={() => {setLocations(locations.filter(loc => loc.id !== x.id))}}>
                            <Text>X</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                 
            })}
        </View>

    )
}

export default International;