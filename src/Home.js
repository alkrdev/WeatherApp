import React from "react";
import { View, Button } from "react-native"
import { weatherConditions, styles } from "./components/Setup"
import Forecast from "./components/home/Forecast"
import CurrentWeather from "./components/home/CurrentWeather"
import { StatusBar } from "expo-status-bar"

const Home = ({navigation, data, forecast}) => {
    return (
        <>
            {/* Main backgroundColor based on the weather of the current geolocation */}
            <View style={[ styles.mainWrapper, { 
                backgroundColor: weatherConditions[data.weather.main].color, 
                justifyContent: "center", 
                alignItems: "center" 
            } ]}>
                {/* StatusBar is allowed to be Styled automatically (Cross-platform) */}
                <StatusBar style="auto" /> 

                <View>
                    {/* Displays the local weather */}
                    <CurrentWeather data={data}/>

                    {/* Displays the local forecast */}
                    <Forecast forecast={forecast}/>
                </View>

            </View>
            {/* Navigation to second screen */}
            <Button title="International" onPress={() => navigation.navigate('International')}></Button>
        </>
    );
}

export default Home;