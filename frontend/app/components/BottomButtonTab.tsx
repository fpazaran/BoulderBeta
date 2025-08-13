import { View } from "react-native";
import { Colors } from "../../assets/Colors";

export default function BottomButtonTab({children, flex = 0.15, alignContent = "space-evenly"} : {children?: React.ReactNode, flex?: number, alignContent?: "space-evenly" | "space-between" | "center"}) {
    return (
        <View style={{
            flex: flex,
            backgroundColor: Colors.mid_gray,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignContent: alignContent
          }}>
            {children}
        </View>
    )
}