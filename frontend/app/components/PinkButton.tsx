import { TouchableOpacity, Text, StyleProp, ViewStyle } from "react-native";
import { Colors } from "../../assets/Colors";

export default function PinkButton({title, onPress, styles} : {title: string, onPress: () => void, styles?: StyleProp<ViewStyle>}) {
    return (
        <TouchableOpacity onPress={onPress} style={[{
            flex: 1,
            borderRadius: 20,
            padding: 10,
            backgroundColor: "#ff0080",
            paddingHorizontal: 30,
            minWidth: 75,
            minHeight: 40,
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
            
          }, styles]} >
            <Text style={{color: "#fff", fontSize: 14, fontWeight: "500", textAlign: "center", alignItems: "center", justifyContent: "center"}}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}