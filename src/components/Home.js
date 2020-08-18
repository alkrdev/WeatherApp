import React from "react";
import { View, StyleSheet, Button } from "react-native"
import { Text } from "../Setup"
import { StatusBar } from "expo-status-bar"

const Home = ({navigation, data, forecast, loading}) => {
    return (        
        <View style={styles.mainWrapper}>
            <StatusBar style="auto" />
            <View style={styles.container}>
                <Text style={styles.title}>Right now</Text>
                <Text>{"Time: " + new Date(data.initialdatetime * 1000).toLocaleTimeString("DK", {})}</Text>
                <Text>{"Temperature: " + data.temperature}</Text>
                <Text>{"Sunrise: " + new Date(data.sunrise * 1000).toLocaleTimeString("DK", {})}</Text>
                <Text>{"Sunset: " + new Date(data.sunset * 1000).toLocaleTimeString("DK", {})}</Text>
                <Text>{"Timezone: " + data.timezone}</Text>
            </View>
            <View style={[styles.container, { alignItems: "center" }]}>
                <Text style={styles.title}>Forecast</Text>
                {loading ? <></> : forecast.map((cast, index) => {
                    var day = new Date(cast.dt * 1000).toLocaleString('en-US', { weekday: "short"})
                    var split = day.split(' ');

                    return <Text key={index}>{split[0] + ": " + cast.temp.day}</Text>
                })}
            </View>
            <Button title="International" onPress={() => navigation.navigate('International')}></Button>
        </View>
    );
}

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: "space-around",
    },
    container: {
        justifyContent: "center",
        alignItems: "flex-start"
    },
    title: {
        fontSize: 45
    }
});

export default Home;