import { View } from "react-native";
import { Colors } from "../../assets/Colors";

export default function BottomButtonTab({children, flex = 0.15} : {children?: React.ReactNode, flex?: number}) {
    return (
        <View style={{
            flex: flex,
            backgroundColor: Colors.dark_gray,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}>
            {children}
        </View>
    )
}