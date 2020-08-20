import React from "react";
import { View } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text, weatherConditions, styles } from "../Setup"

// Component made to display data, provided on render.
// Main usage is "Home"
const CurrentWeather = ({data}) => {
    // Hooks, Context is created purely for cosmetic purposes
    const [context, setContext] = React.useState({})
    const [loading, setLoading] = React.useState(true);

    // useEffect setup with an empty DependencyArray, so it will only run once on re-render
    React.useEffect(() => {
        setContext({
            temperature: data.temperature,
            time: new Date(data.initialdatetime * 1000).toLocaleTimeString("DK", {}),
            sunrise: new Date(data.sunrise * 1000).toLocaleTimeString("DK", {}),
            sunset: new Date(data.sunset * 1000).toLocaleTimeString("DK", {}),
        })
        setLoading(true)
    }, [])

    return (
        loading ? (
            <View style={styles.container}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={styles.title}>Right now - </Text>           
                    <MaterialCommunityIcons size={59} name={weatherConditions[data.weather.main].icon} color={"#FFF"}/>
                </View>
                <Text>{"Temperature: " + context.temperature}°</Text> 
                <Text>{"Time: " + context.time}</Text>
                <Text>{"Sunrise: " + context.sunrise}</Text>
                <Text>{"Sunset: " + context.sunset}</Text>
            </View>
        ) : <></>
    )
}

export default CurrentWeather;