import { ImageBackground, PanResponder, View, Image, LayoutChangeEvent, StyleSheet } from "react-native";
import { Hold, Tool } from "../../../types/climb";
import { useEffect, useState } from "react";
import BottomButtonTab from "../BottomButtonTab";
import ToolButton from "../ToolButton";
import Svg from "react-native-svg";
import { Colors } from "@/assets/Colors";
import PinkRectangle from "../PinkRectangle";

export default function PhotoAnnotator({imageFlex = 0.75, bottomTabFlex = 0.1, handleSetHolds, image} : {imageFlex?: number, bottomTabFlex?: number, handleSetHolds: (ratio: number, holds: Hold[]) => void, image: string}) {
    const [holds, setHolds] = useState<Hold[]>([]);
    const [imageSize, setImageSize] = useState({width: 0, height: 0});
    const [imageRatio, setImageRatio] = useState(1);
    const [containerSize, setContainerSize] = useState({width: 0, height: 0});
    const [currentHold, setCurrentHold] = useState<{position: {top: number, left: number}, size: {width: number, height: number}} | null>(null);
    const [tool, setTool] = useState<Tool>("rectangle");
    const [selectedHoldId, setSelectedHoldId] = useState<string | null>(null);
    const [dragStart, setDragStart] = useState<{x: number, y: number} | null>(null);
    const [initialHoldPosition, setInitialHoldPosition] = useState<{ left: number; top: number } | null>(null); // hold start

    const scale = .95;
    const scaleByHeight = false;
    const minRectangleSize = 15;    

    const handleChangeTool = (tool: Tool) => {
        setTool(tool);
        setSelectedHoldId(null);
    };

    const normalizeRect = (x1: number, y1: number, x2: number, y2: number) => {
        // ensure positive width/height regardless of drag direction
        const left = Math.min(x1, x2);
        const top = Math.min(y1, y2);
        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);
        return { left, top, width, height };
    };

    const constrainToImageBounds = (x: number, y: number) => {
        const scaledWidth = imageSize.width * imageRatio;
        const scaledHeight = imageSize.height * imageRatio;
        return {
            x: Math.max(0, Math.min(x, scaledWidth)),
            y: Math.max(0, Math.min(y, scaledHeight))
        };
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt, gestureState) => {
            const { locationX, locationY } = evt.nativeEvent;
            const constrained = constrainToImageBounds(locationX, locationY);

            if (tool === "rectangle") {
                setCurrentHold({
                    position: { top: constrained.y, left: constrained.x },
                    size: { width: 0, height: 0 }
                });
            } else if (tool === "move") {
                const hold = holds.find(
                    (h) =>
                    locationX >= h.position.left &&
                    locationX <= h.position.left + h.size.width &&
                    locationY >= h.position.top &&
                    locationY <= h.position.top + h.size.height
                );
                if (hold) {
                    setSelectedHoldId(hold.id);
                    setDragStart({ x: locationX, y: locationY });
                    setInitialHoldPosition({ ...hold.position });
                }
            } else{
                const hold = holds.find(
                    (h) =>
                    locationX >= h.position.left &&
                    locationX <= h.position.left + h.size.width &&
                    locationY >= h.position.top &&
                    locationY <= h.position.top + h.size.height
                );
                if (hold) {
                    setSelectedHoldId(hold.id);
                }
            }
        },
        onPanResponderMove: (evt, gestureState) => {
            const { locationX, locationY } = evt.nativeEvent;
            const constrained = constrainToImageBounds(locationX, locationY);

            if (tool === "rectangle" && currentHold) {
                const { position } = currentHold;
                setCurrentHold({ 
                    position, 
                    size: { 
                        width: constrained.x - position.left, 
                        height: constrained.y - position.top 
                    } 
                });
            }
      
            if (tool === "move" && selectedHoldId && dragStart && initialHoldPosition) {
              const deltaX = locationX - dragStart.x;
              const deltaY = locationY - dragStart.y;

              setHolds((prevHolds) =>
                prevHolds.map((hold) => {
                  if (hold.id === selectedHoldId) {
                    const newLeft = initialHoldPosition.left + deltaX;
                    const newTop = initialHoldPosition.top + deltaY;
                    const scaledWidth = imageSize.width * imageRatio;
                    const scaledHeight = imageSize.height * imageRatio;

                    // Constrain the entire rectangle within bounds
                    const constrainedLeft = Math.max(0, Math.min(newLeft, scaledWidth - hold.size.width));
                    const constrainedTop = Math.max(0, Math.min(newTop, scaledHeight - hold.size.height));

                    return {
                      ...hold,
                      position: {
                        left: constrainedLeft,
                        top: constrainedTop
                      }
                    };
                  }
                  return hold;
                })
              );
            }
        },
        onPanResponderRelease: (evt, gestureState) => {
            const { locationX, locationY } = evt.nativeEvent;
            const constrained = constrainToImageBounds(locationX, locationY);

            if (tool === "rectangle" && currentHold) {
                const { position } = currentHold;
                const rect = normalizeRect(position.left, position.top, constrained.x, constrained.y);

                if (rect.width < minRectangleSize && rect.height < minRectangleSize) {
                    setCurrentHold(null);
                    return;
                }

                // Keep in display space for rendering
                const newHold = {
                    id: Date.now().toString(),
                    position: { left: rect.left, top: rect.top },
                    size: { width: rect.width, height: rect.height }
                };

                // Store in state as-is (display space)
                setHolds((prev) => [...prev, newHold]);
                handleSetHolds(imageRatio, [...holds, newHold]);

                // Normalize only for callback
                    ({
                ...newHold,
                position: {
                    left: newHold.position.left / imageRatio,
                    top: newHold.position.top / imageRatio
                },
                size: {
                    width: newHold.size.width / imageRatio,
                    height: newHold.size.height / imageRatio
                }
                });

                setCurrentHold(null);
            }

            if (tool === "move") {
                setSelectedHoldId(null);
                setDragStart(null);
                setInitialHoldPosition(null);
                handleSetHolds(imageRatio, holds);
            }

            if (tool === "delete") {
                setHolds((prev) => prev.filter((hold) => hold.id !== selectedHoldId));
                setSelectedHoldId(null);
                handleSetHolds(imageRatio, holds.filter((hold) => hold.id !== selectedHoldId));
            }
        }
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
                        { currentHold && <PinkRectangle x={currentHold.position.left} y={currentHold.position.top} width={currentHold.size.width} height={currentHold.size.height} />}
                        { holds.map((hold) => (
                            <PinkRectangle key={hold.id} x={hold.position.left} y={hold.position.top} width={hold.size.width} height={hold.size.height} />
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