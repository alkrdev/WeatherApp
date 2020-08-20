import React from "react";
import { Text} from "../Setup"
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const LocationsList = ({locations, setLocations}) => {
    return (
        locations.map(x => {
            return (
                <View key={x.id} style={ListViewItem}>
                    <Text style={{ marginLeft: 20}}>{x.name}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text>{x.temperature}°</Text>
                        <TouchableOpacity style={DeleteButton} onPress={() => {
                            // Sets the current list of locations, to 
                            // a new list without the one specified by ID (In other words, delete)
                            setLocations(locations.filter(loc => loc.id !== x.id))
                        }}>
                            <Text>X</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )                 
        })
    )
}

const ListViewItem = { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginTop: 10 
}

const DeleteButton = {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DDDDDD",
    width: 70,
    height: 50,
    marginLeft: 10,
    marginRight: 20
}

export default LocationsList;