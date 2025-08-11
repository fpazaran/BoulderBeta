import { TouchableOpacity, Text } from "react-native";
import { Colors } from "../../assets/Colors";

export default function PinkButton({title, onPress} : {title: string, onPress: () => void}) {
    return (
        <TouchableOpacity onPress={onPress} style={{
            flex: 1,
            borderRadius: 20,
            padding: 10,
            backgroundColor: "#ff0080",
            paddingHorizontal: 30,
            minWidth: 75,
            minHeight: 40,
            alignItems: "center",
            justifyContent: "center",
          }} >
            <Text style={{color: "#fff", fontSize: 14, fontWeight: "500", textAlign: "center"}}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}