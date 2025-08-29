import { View, ImageBackground, LayoutChangeEvent, StyleSheet } from "react-native";
import { Hold } from "@/types/climb";
import { useState } from "react";
import Svg from "react-native-svg";
import PinkRectangle from "../PinkRectangle";
import { Colors } from "../../../assets/Colors";
import { useImageRatio } from '../../../utils/imageUtils';

export default function PhotoHoldView({
  image,
  holds,
  flex = 0.6,
  setHolds = () => {},
  setSelectedHoldID,
  backgroundColor = Colors.white
}: {
  image: any;
  holds?: Hold[];
  flex?: number;
  setHolds?: (holds: Hold[]) => void;
  setSelectedHoldID: (id: string | null) => void;
  backgroundColor?: string;
}) {
  const [selectedHold, setSelectedHold] = useState<Hold | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const { imageSize, imageRatio } = useImageRatio(image, containerSize, 0.95);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  return (
    <View style={[styles.container, { flex: flex, backgroundColor: backgroundColor }]} onLayout={onLayout}>
      <ImageBackground
        source={{ uri: image }}
        resizeMode="contain"
        style={{
          width: imageSize.width * imageRatio,
          height: imageSize.height * imageRatio,
        }}
      >
        <Svg style={{ width: imageSize.width * imageRatio, height: imageSize.height * imageRatio }}>
          {selectedHold && (
            <PinkRectangle
              onPress={() => {
                setSelectedHoldID(null);
              }}
              x={selectedHold.position.left * imageRatio}
              y={selectedHold.position.top * imageRatio}
              width={selectedHold.size.width * imageRatio}
              height={selectedHold.size.height * imageRatio}
            />
          )}
          {holds && holds.map((hold) => (
            <PinkRectangle
              onPress={() => {
                setSelectedHoldID(hold.id);
              }}
              key={hold.id}
              x={hold.position.left * imageRatio}
              y={hold.position.top * imageRatio}
              width={hold.size.width * imageRatio}
              height={hold.size.height * imageRatio}
            />
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
    borderRadius: 10,
  },
});