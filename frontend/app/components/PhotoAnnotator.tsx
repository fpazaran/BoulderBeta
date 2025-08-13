import { ImageBackground, PanResponder, View, Image, LayoutChangeEvent, StyleSheet } from "react-native";
import { Hold, Tool } from "../../types/climb";
import { useEffect, useState } from "react";
import BottomButtonTab from "./BottomButtonTab";
import ToolButton from "./ToolButton";
import Svg, { Rect } from "react-native-svg";
import { Colors } from "@/assets/Colors";

export default function PhotoAnnotator({imageFlex = 0.75, bottomTabFlex = 0.1, handleAddHold, image} : {imageFlex?: number, bottomTabFlex?: number, handleAddHold: (hold: Hold) => void, image: string}) {
    const [holds, setHolds] = useState<Hold[]>([]);
    const [imageSize, setImageSize] = useState({width: 0, height: 0});
    const [imageRatio, setImageRatio] = useState(1);
    const [containerSize, setContainerSize] = useState({width: 0, height: 0});
    const [currentHold, setCurrentHold] = useState<{position: {top: number, left: number}, size: {width: number, height: number}} | null>(null);
    const [tool, setTool] = useState<Tool>("rectangle");

    const scale = .95;
    const scaleByHeight = false;

    const handleChangeTool = (tool: Tool) => {
        setTool(tool);
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt, gestureState) => {
            const { locationX, locationY } = evt.nativeEvent;
            if (tool === "rectangle") {
                setCurrentHold({position: {top: locationY, left: locationX}, size: {width: 0, height: 0}});
            } 
        },
        onPanResponderMove: (evt, gestureState) => {
            const { locationX, locationY } = evt.nativeEvent;
            const { position } = currentHold || { position: { top: 0, left: 0 } };
            if (tool === "rectangle") {
                setCurrentHold({
                    position,
                    size: {
                        width: locationX - position.left,
                        height: locationY - position.top
                    }
                });
            }
        },
        onPanResponderRelease: (evt, gestureState) => {
            const { locationX, locationY } = evt.nativeEvent;
            const { position } = currentHold || { position: { top: 0, left: 0 } };
            if (tool === "rectangle") {
                setHolds([
                    ...holds,
                    {
                        id: Date.now().toString(),
                        position,
                        size: {
                            width: locationX - position.left,
                            height: locationY - position.top
                        }
                    }
                ]);   
            }
        },
    });

    useEffect(() => {
        Image.getSize(image, (width, height) => {
            setImageSize({width, height});
        }, (error) => {
            console.error("Error getting image size:", error);
        });
    }, [image]);

    useEffect(() => {
        // Calculate ratio only when both container and image sizes are available
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
        <View style={{flex: imageFlex + bottomTabFlex, flexDirection: "column"}}>
            {/* image */}
            <View style={styles.imageContainer} onLayout={onLayout}>
                <ImageBackground source={{ uri: image }} 
                resizeMode="contain" 
                style={{width: imageSize.width * imageRatio, 
                height: imageSize.height * imageRatio}}>
                    <Svg {...panResponder.panHandlers} style={{width: imageSize.width * imageRatio, height: imageSize.height * imageRatio}}>
                        { currentHold && 
                        <Rect x={currentHold.position.left} y={currentHold.position.top} width={currentHold.size.width} height={currentHold.size.height} fill="red" />
                        }
                        { holds.map((hold) => (
                            <Rect key={hold.id} x={hold.position.left} y={hold.position.top} width={hold.size.width} height={hold.size.height} fill="red" />
                        ))}
                    </Svg>
                </ImageBackground>
            </View>

            {/* tool selection */}
            <BottomButtonTab flex={0.15}>
                <View style={styles.buttonContainer}>
                    <ToolButton tool={"rectangle"} handleChangeTool={handleChangeTool} />
                </View>
                <View style={styles.buttonContainer}>
                    <ToolButton tool={"move"} handleChangeTool={handleChangeTool} />
                </View>
                <View style={styles.buttonContainer}>
                    <ToolButton tool={"delete"} handleChangeTool={handleChangeTool} />
                </View>
            </BottomButtonTab>
        </View>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        flex: 0.9,
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: Colors.pink
    },
    buttonContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});