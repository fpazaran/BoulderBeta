import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  SafeAreaView,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../types/navigation";

export default function CameraScreen() {
  const [facing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<string | null>(null);
  let camera = useRef<CameraView>(null);
  const navigation = useNavigation<RootStackNavigationProp>();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    requestPermission();
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
      </View>
    );
  }

  const handleTakePhoto = async () => {
    if (camera.current) {
      const data = await camera.current.takePictureAsync({
        quality: 0.5, // Lower quality for faster processing
        base64: false, // Don't generate base64 data
        exif: false, // Don't include EXIF data
        skipProcessing: true, // Skip additional image processing
      });
      setImage(data.uri);
    }
  };

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePredict = () => {
    // TODO: Implement prediction logic
    if (image) {
      navigation.navigate("CreateOrPredict", { image, create: false });
    } else {
      console.log("No image selected");
    }
  };

  const handleCreate = () => {
    // TODO: Implement create logic
    if (image) {
      navigation.navigate("CreateOrPredict", { image, create: true });
    } else {
      console.log("No image selected");
    }
  };

  const handleCancel = () => {
    setImage(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        {/* Top Section - Top Bar */}
        <View style={styles.topBar}>
          {image ? (
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.pinkButton}
                onPress={handleCancel}
              >
                <Text style={styles.choosePhotoText}>Cancel</Text>
              </TouchableOpacity>
              {/* for even spacing */}
              <View
                style={{
                  alignSelf: "flex-start",
                  borderRadius: 20,
                  padding: 10,
                  paddingHorizontal: 20,
                  minWidth: 75,
                }}
              ></View>
            </View>
          ) : null}
        </View>

        {/* Middle Section - Camera View */}
        <View style={styles.cameraSection}>
          {image ? (
            <Image source={{ uri: image }} style={{ flex: 1 }} />
          ) : (
            <CameraView facing={facing} style={{ flex: 1 }} ref={camera} />
          )}
        </View>

        {/* Bottom Section - Controls */}
        <View style={styles.controlsSection}>
          {image ? (
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.pinkButton}
                onPress={handlePredict}
              >
                <Text style={styles.choosePhotoText}>Predict</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pinkButton}
                onPress={handleCreate}
              >
                <Text style={styles.choosePhotoText}>Create</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cameraControls}>
              {/* Choose Photo Button */}
              <View style={styles.choosePhotoButtonContainer}>
                <TouchableOpacity
                  style={styles.choosePhotoButton}
                  onPress={handleChoosePhoto}
                >
                  <Text style={styles.choosePhotoText}>Choose Photo</Text>
                </TouchableOpacity>
              </View>

              {/* Take Photo Button */}
              <View style={styles.captureButtonContainer}>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={handleTakePhoto}
                >
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
              </View>

              {/* Placeholder for symmetry */}
              <View style={styles.placeholder} />
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
    width: "100%",
    paddingHorizontal: 40,
  },
  choosePhotoButtonContainer: {
    flex: 1,
    alignItems: "center",
  },
  choosePhotoButton: {
    alignItems: "center",
  },
  choosePhotoText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  captureButtonContainer: {
    flex: 1,
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.3)",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  placeholder: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
});
