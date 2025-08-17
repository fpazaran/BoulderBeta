import { Colors } from "@/assets/Colors";
import { Rect } from "react-native-svg";

export default function PinkRectangle({onPress, x, y, width, height}: {onPress?: () => void, x: number, y: number, width: number, height: number}) {
    return(
        <Rect
            x={x}
            y={y}
            width={width}
            height={height}
            stroke={Colors.pink}
            strokeWidth="2"
            fill={Colors.transparent_pink}
            onPress={onPress ? onPress : undefined}
        />
    )
}