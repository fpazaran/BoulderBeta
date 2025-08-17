import { View, ImageBackground, Image, LayoutChangeEvent, StyleSheet } from "react-native";
import { Hold } from "@/types/climb";
import { useEffect, useState } from "react";
import Svg, { Rect } from "react-native-svg";
import PinkRectangle from "../PinkRectangle";
import { Colors } from "../../../assets/Colors";

export default function PhotoHoldView({image, holds, flex = 0.6, setHolds, setSelectedHoldID} : {image: string, holds: Hold[], flex?: number, setHolds: (holds: Hold[]) => void, setSelectedHoldID: (id: string | null) => void}) {
    const [selectedHold, setSelectedHold] = useState<Hold | null>(null);
    const [imageSize, setImageSize] = useState({width: 0, height: 0});
    const [imageRatio, setImageRatio] = useState(1);
    const [containerSize, setContainerSize] = useState({width: 0, height: 0});

    const scale = .95;
    const scaleByHeight = false;

    useEffect(() => {
        Image.getSize(image, (width, height) => {
            setImageSize({width, height});
        }, (error) => {
            console.error("Error getting image size:", error);
        });
    }, [image]);

    useEffect(() => {

        if (containerSize.height > 0 && imageSize.height > 0) {
            const ratio = scaleByHeight ? 
                (scale * containerSize.height) / imageSize.height 
                : (scale * containerSize.width) / imageSize.width;
            setImageRatio(ratio);
        }
    }, [containerSize, imageSize, scale]);

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerSize({width, height});
    };

    return (
        <View style={[styles.container, {flex: flex}]} onLayout={onLayout}>
            <ImageBackground source={{ uri: image }} resizeMode="contain" style={{width: imageSize.width * imageRatio, height: imageSize.height * imageRatio}}>
                <Svg style={{width: imageSize.width * imageRatio, height: imageSize.height * imageRatio}}>
                    { selectedHold && <PinkRectangle onPress={() => {setSelectedHoldID(null)}} x={selectedHold.position.left / imageRatio} y={selectedHold.position.top / imageRatio} width={selectedHold.size.width / imageRatio} height={selectedHold.size.height / imageRatio} />}
                    { holds.map((hold) => (
                        <PinkRectangle onPress={() => {setSelectedHoldID(hold.id)}} key={hold.id} x={hold.position.left / imageRatio} y={hold.position.top / imageRatio} width={hold.size.width / imageRatio} height={hold.size.height / imageRatio} />
                    ))}
                </Svg>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.pink,
        justifyContent: "center",
        alignItems: "center",
    },
});