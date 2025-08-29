import { ImageBackground, PanResponder, View, LayoutChangeEvent, StyleSheet } from "react-native";
import { Hold, Tool } from "../../../types/climb";
import { useState } from "react";
import BottomButtonTab from "../BottomButtonTab";
import ToolButton from "../ToolButton";
import Svg from "react-native-svg";
import { Colors } from "@/assets/Colors";
import PinkRectangle from "../PinkRectangle";
import { useImageRatio } from '../../../utils/imageUtils';

export default function PhotoAnnotator({ 
  imageFlex = 0.75, 
  bottomTabFlex = 0.1, 
  handleSetHolds, 
  image 
}: { 
  imageFlex?: number, 
  bottomTabFlex?: number, 
  handleSetHolds: (holds: Hold[]) => void, 
  image: string 
}) {
  const [holds, setHolds] = useState<Hold[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [currentHold, setCurrentHold] = useState<{ position: { top: number, left: number }, size: { width: number, height: number } } | null>(null);
  const [tool, setTool] = useState<Tool>("rectangle");
  const [selectedHoldId, setSelectedHoldId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
  const [initialHoldPosition, setInitialHoldPosition] = useState<{ left: number; top: number } | null>(null);

  const minRectangleSize = 15;

  // Use the hook instead of manual state management
  const { imageSize, imageRatio } = useImageRatio(image, containerSize, 0.95);

  const handleChangeTool = (tool: Tool) => {
      setTool(tool);
      setSelectedHoldId(null);
  };

  const normalizeRect = (x1: number, y1: number, x2: number, y2: number) => {
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
                  position: { top: constrained.y / imageRatio, left: constrained.x / imageRatio },
                  size: { width: 0, height: 0 }
              });
          } else if (tool === "move") {
              const hold = holds.find(
                  (h) =>
                  locationX >= h.position.left * imageRatio &&
                  locationX <= (h.position.left + h.size.width) * imageRatio &&
                  locationY >= h.position.top * imageRatio &&
                  locationY <= (h.position.top + h.size.height) * imageRatio
              );
              if (hold) {
                  setSelectedHoldId(hold.id);
                  setDragStart({ x: locationX, y: locationY });
                  setInitialHoldPosition({ ...hold.position });
              }
          } else {
              const hold = holds.find(
                  (h) =>
                  locationX >= h.position.left * imageRatio &&
                  locationX <= (h.position.left + h.size.width) * imageRatio &&
                  locationY >= h.position.top * imageRatio &&
                  locationY <= (h.position.top + h.size.height) * imageRatio
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
                      width: (constrained.x / imageRatio) - position.left,
                      height: (constrained.y / imageRatio) - position.top
                  }
              });
          }

          if (tool === "move" && selectedHoldId && dragStart && initialHoldPosition) {
              const deltaX = (locationX - dragStart.x) / imageRatio;
              const deltaY = (locationY - dragStart.y) / imageRatio;

              setHolds((prevHolds) =>
                  prevHolds.map((hold) => {
                      if (hold.id === selectedHoldId) {
                          const newLeft = initialHoldPosition.left + deltaX;
                          const newTop = initialHoldPosition.top + deltaY;

                          const constrainedLeft = Math.max(0, Math.min(newLeft, imageSize.width - hold.size.width));
                          const constrainedTop = Math.max(0, Math.min(newTop, imageSize.height - hold.size.height));

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
              const rect = normalizeRect(position.left, position.top, constrained.x / imageRatio, constrained.y / imageRatio);

              if (rect.width < minRectangleSize && rect.height < minRectangleSize) {
                  setCurrentHold(null);
                  return;
              }

              // Store hold in image space
              const newHold = {
                  id: Date.now().toString(),
                  position: { left: rect.left, top: rect.top },
                  size: { width: rect.width, height: rect.height }
              };

              // Add to holds (image-space positions)
              const updatedHolds = [...holds, newHold];
              setHolds(updatedHolds);
              handleSetHolds(updatedHolds);

              setCurrentHold(null);
          }

          if (tool === "move") {
              setSelectedHoldId(null);
              setDragStart(null);
              setInitialHoldPosition(null);
              handleSetHolds(holds);
          }

          if (tool === "delete") {
              const filteredHolds = holds.filter((hold) => hold.id !== selectedHoldId);
              setHolds(filteredHolds);
              setSelectedHoldId(null);
              handleSetHolds(filteredHolds);
          }
      }
  });

  const onLayout = (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      setContainerSize({ width, height });
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
                      { currentHold && <PinkRectangle x={currentHold.position.left*imageRatio} y={currentHold.position.top*imageRatio} width={currentHold.size.width*imageRatio} height={currentHold.size.height*imageRatio} />}
                      { holds.map((hold) => (
                          <PinkRectangle key={hold.id} x={hold.position.left*imageRatio} y={hold.position.top*imageRatio} width={hold.size.width*imageRatio} height={hold.size.height*imageRatio} />
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