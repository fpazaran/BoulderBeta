import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  PanResponder,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";
import { Hold, Tool } from "@/types/climb";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Svg, Rect } from "react-native-svg";
import {
  RootStackNavigationProp,
  RootStackRouteProp,
} from "@/types/navigation";

export default function CreateOrPredict() {
  const route = useRoute<RootStackRouteProp<"CreateOrPredict">>();
  const { image, create } = route.params;
  const navigation = useNavigation<RootStackNavigationProp>();
  const [holds, setHolds] = useState<Hold[]>([]);
  const [tool, setTool] = useState<Tool>("rectangle");
  const [selectedHoldId, setSelectedHoldId] = useState<string | null>(null);
  const [currentHold, setCurrentHold] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const imageRef = useRef<Image>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );

  const colors = {
    selected: "#ff0080",
    unselected: "#fff",
  };

  const toolSize = 40;

  const minSize = 10;

  const deleteHoldAtPosition = (x: number, y: number) => {
    const holdIndex = holds.findIndex((hold) => {
      const left =
        hold.size.width >= 0
          ? hold.position.left
          : hold.position.left + hold.size.width;
      const top =
        hold.size.height >= 0
          ? hold.position.top
          : hold.position.top + hold.size.height;
      const width = Math.abs(hold.size.width);
      const height = Math.abs(hold.size.height);

      return x >= left && x <= left + width && y >= top && y <= top + height;
    });

    if (holdIndex !== -1) {
      const newHolds = [...holds];
      newHolds.splice(holdIndex, 1);
      setHolds(newHolds);
      setSelectedHoldId(null);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      if (tool === "rectangle") {
        setCurrentHold({
          x: locationX,
          y: locationY,
          width: 0,
          height: 0,
        });
      } else if (tool === "select") {
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
        }
      } else if (tool === "delete") {
      }
    },
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      if (tool === "rectangle") {
        if (currentHold) {
          setCurrentHold((prev) => ({
            ...prev!,
            width: locationX - prev!.x,
            height: locationY - prev!.y,
          }));
        }
      } else if (tool === "select" && selectedHoldId && dragStart) {
        const deltaX = locationX - dragStart.x;
        const deltaY = locationY - dragStart.y;

        setHolds((prevHolds) =>
          prevHolds.map((hold) => {
            if (hold.id === selectedHoldId) {
              return {
                ...hold,
                position: {
                  left: hold.position.left + deltaX,
                  top: hold.position.top + deltaY,
                },
              };
            }
            return hold;
          })
        );
        setDragStart({ x: locationX, y: locationY });
      }
    },
    onPanResponderEnd: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      if (tool === "rectangle") {
        if (currentHold) {
          const width = locationX - currentHold.x;
          const height = locationY - currentHold.y;
          if (width > minSize && height > minSize) {
            handleAddHold({
              id: Date.now().toString(),
              nextHold: undefined,
              position: {
                top: height >= 0 ? currentHold.y : currentHold.y + height,
                left: width >= 0 ? currentHold.x : currentHold.x + width,
              },
              size: {
                width: Math.abs(width),
                height: Math.abs(height),
              },
            });
          }
        }
        setCurrentHold(null);
      } else if (tool === "delete") {
        deleteHoldAtPosition(locationX, locationY);
        console.log(holds);
      }
      setSelectedHoldId(null);
      setDragStart(null);
    },
  });

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleCreate = () => {
    navigation.navigate("ClimbDetailsForm", { holds: holds });
    // Navigate back to camera
    navigation.navigate("Camera");
  };

  const handlePredict = () => {
    navigation.navigate("Prediction", { holds: holds });
    console.log("Predicting route");
  };

  const handleAddHold = (hold: Hold) => {
    setHolds([...holds, hold]);
  };

  const handleChangeTool = (tool: Tool) => {
    setTool(tool);
    setSelectedHoldId(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Section - Top Bar */}
        <View style={styles.topBar}>
          {image ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.pinkButton}
                onPress={handleCancel}
              >
                <Text style={styles.choosePhotoText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pinkButton}
                onPress={create ? handleCreate : handlePredict}
              >
                <Text style={styles.choosePhotoText}>
                  {create ? "Create" : "Predict"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {/* Middle Section - Camera View */}
        <View style={styles.cameraSection} {...panResponder.panHandlers}>
          <Image source={{ uri: image }} style={styles.image} ref={imageRef} />
          <Svg style={styles.svgLayer} width="100%" height="100%">
            {currentHold && (
              <Rect
                x={currentHold.x}
                y={currentHold.y}
                width={currentHold.width}
                height={currentHold.height}
                stroke="#ff0080"
                strokeWidth="2"
                fill="rgba(255, 0, 128, 0.2)"
              />
            )}
            {holds.map((hold) => (
              <Rect
                key={hold.id}
                x={hold.position.left}
                y={hold.position.top}
                width={hold.size.width}
                height={hold.size.height}
                stroke="#ff0080"
                strokeWidth="2"
                fill="rgba(255, 0, 128, 0.2)"
              />
            ))}
          </Svg>
        </View>

        {/* Bottom Section - Controls */}
        <View style={styles.controlsSection}>
          {create ? (
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.toolButton}
                onPress={() => handleChangeTool("rectangle")}
              >
                <MaterialIcons
                  name="crop-square"
                  size={toolSize}
                  color={
                    tool === "rectangle" ? colors.selected : colors.unselected
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.toolButton}
                onPress={() => handleChangeTool("select")}
              >
                <MaterialIcons
                  name="timeline"
                  size={toolSize}
                  color={
                    tool === "select" ? colors.selected : colors.unselected
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.toolButton}
                onPress={() => handleChangeTool("delete")}
              >
                <Ionicons
                  name="trash-outline"
                  size={toolSize}
                  color={
                    tool === "delete" ? colors.selected : colors.unselected
                  }
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.controlsSection}>
              <View style={styles.cameraControls}>
                <TouchableOpacity
                  style={styles.toolButton}
                  onPress={() => setTool("rectangle")}
                >
                  <MaterialIcons
                    name="crop-square"
                    size={toolSize}
                    color={
                      tool === "rectangle" ? colors.selected : colors.unselected
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.toolButton}
                  onPress={() => setTool("delete")}
                >
                  <Ionicons
                    name="trash-outline"
                    size={toolSize}
                    color={
                      tool === "delete" ? colors.selected : colors.unselected
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  topBar: {
    flex: 0.1,
    backgroundColor: "#111",
    justifyContent: "flex-end",
    paddingBottom: 15,
  },
  pinkButton: {
    alignSelf: "flex-start",
    borderRadius: 20,
    padding: 10,
    backgroundColor: "#ff0080",
    paddingHorizontal: 20,
    minWidth: 75,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 40,
  },
  cameraSection: {
    flex: 0.75,
    position: "relative",
  },
  controlsSection: {
    flex: 0.15,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "85%",
  },
  choosePhotoText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  toolButton: {
    borderRadius: 10,
    padding: 0,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    marginHorizontal: 10,
  },
  toolButtonSelected: {
    backgroundColor: "#222",
    borderWidth: 2,
    borderColor: "#ff0080",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  svgLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
