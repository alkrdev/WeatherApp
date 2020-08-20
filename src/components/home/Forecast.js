import React from "react";
import { View } from "react-native"
import { Text, styles } from "../Setup"

const Forecast = ({forecast}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forecast</Text>
            {/* Map Array Function, to return multiple Text elements with their own seperate pieces of data */}
            {forecast.map((cast, index) => {
                // date setup to supply specific version of "day": "fri, thu, wed...."
                var day = new Date(cast.dt * 1000).toLocaleString('en-US', { weekday: "short"})
                // Split up the provided string, to grab "Day"
                var split = day.split(' ');

                return <Text key={index}>{split[0] + ": " + cast.temp.day}°</Text>
            })}
        </View> 
    )
}

export default Forecast;