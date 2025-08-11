import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, LayoutChangeEvent, ImageBackground } from "react-native";
import { RootStackRouteProp } from "@/types/navigation";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Svg, Rect } from "react-native-svg";
import { RootStackNavigationProp } from "@/types/navigation";
import { useState, useEffect } from "react";
import { Hold } from "@/types/climb";

export default function ClimbDetailsFormScreen() {
  const route = useRoute<RootStackRouteProp<"ClimbDetailsForm">>();
  const { holds, image, originalImageSize } = route.params;
  const navigation = useNavigation<RootStackNavigationProp>();
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imageContainerSize, setImageContainerSize] = useState({ width: 0, height: 0 });
  const [ratio, setRatio] = useState(1);
  const [padding, setPadding] = useState({ x: 0, y: 0 });

  const handleOnLayout = (event: LayoutChangeEvent) => {
    const { width: containerWidth, height: containerHeight } = event.nativeEvent.layout;
  
    // Store container size in case we need it later
    setImageContainerSize({ width: containerWidth, height: containerHeight });
  
    // Compute scale factor based on how the image will fit inside container
    const scale = Math.min(
      containerWidth / originalImageSize.width,
      containerHeight / originalImageSize.height
    );
  
    // The actual drawn image size
    const drawnWidth = originalImageSize.width * scale;
    const drawnHeight = originalImageSize.height * scale;
  
    // Padding caused by 'contain'
    const padX = (containerWidth - drawnWidth) / 2;
    const padY = (containerHeight - drawnHeight) / 2;
  
    setImageSize({ width: drawnWidth, height: drawnHeight });
    setPadding({ x: padX, y: padY });
    setRatio(scale);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCreate = () => {
    console.log("create climb");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* top bar (back/create climb buttons)*/}
        <View style={styles.topBar}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.pinkButton}
              onPress={handleBack}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.pinkButton}
              onPress={handleCreate}
            >
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.detailsSection}>
          {/* image with holds */}
          <View style={styles.imageContainer}>
            <ImageBackground
              source={{ uri: image }} 
              style={styles.image} 
              resizeMode="contain"
              onLayout={handleOnLayout}
            >
              <Svg
                width="100%"
                height="100%"
                style={StyleSheet.absoluteFill}
              >
                {holds.map((hold) => (
                  <Rect 
                    key={hold.id}
                    x={hold.position.left * ratio + padding.x}
                    y={hold.position.top * ratio + padding.y}
                    width={hold.size.width * ratio}
                    height={hold.size.height * ratio}
                    stroke="#ff0080"
                    strokeWidth="2"
                    fill="rgba(255, 0, 128, 0.2)"
                  />
                ))}
              </Svg>
            </ImageBackground>
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.pinkContainer}>
              <Text style={styles.buttonText}>Selected Hold</Text>
            </View>
            <View style={styles.pinkContainer}>
              <Text style={styles.buttonText}>Gym Selector</Text>
            </View>
            <View style={styles.pinkContainer}>
              <Text style={styles.buttonText}>Grade Selector</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  topBar: {
    flex: 0.1,
    backgroundColor: "#111",
    justifyContent: "flex-end",
    paddingBottom: 15,
  },
  pinkButton: {
    alignSelf: "flex-start",
    alignItems: "center",
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
    paddingHorizontal: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  detailsSection: {
    flex: 0.9,
    marginTop: 20,
    backgroundColor: "#333",
    borderRadius: 15,
  },
  imageContainer: {
    flex: 0.5,
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: 9/16,
  },
  detailsContainer: {
    flex: 0.5,
  },
  pinkContainer: {
    flex: 0.3,
    backgroundColor: "#ff0080",
    borderRadius: 30,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
