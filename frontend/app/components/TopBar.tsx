import { View } from "react-native";
import { Colors } from "../../assets/Colors";

export default function TopBar({children, flex = 0.1} : {children?: React.ReactNode, flex?: number}) {
    return (
        <View style={{
            flex: flex,
            backgroundColor: Colors.mid_gray,
            flexDirection: "row",
        }}>
            {children}
        </View>
    )
}