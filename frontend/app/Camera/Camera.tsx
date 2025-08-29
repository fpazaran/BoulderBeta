import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../types/navigation";
import PhotoPreviewSection from "../components/Photo/PhotoPreviewSection";
import BottomButtonTab from "../components/BottomButtonTab";
import { Colors } from "../../assets/Colors";
import TopBar from "../components/TopBar";

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
      try {
        const data = await camera.current.takePictureAsync({
          quality: 0.5, // Lower quality for faster processing
          base64: false, // Don't generate base64 data
          exif: false, // Don't include EXIF data
          skipProcessing: true, // Skip additional image processing
        });
        setImage(data.uri);
      } catch (error) {
        console.error("Failed to take photo:", error);
      }
    };
  } 

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      aspect: [9, 16],
      allowsEditing: true,
    });
    if (result.assets) {
      setImage(result.assets[0].uri);;
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

  if (image){ 
    return (<PhotoPreviewSection 
    photo={image} 
    handleRetake={handleCancel} 
    handlePredict={handlePredict} 
    handleCreate={handleCreate} />) 
  }
  return (
    <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        {/* Top Section - Top Bar */}
        <TopBar/>

        {/* Middle Section - Camera View */}
        <View style={styles.cameraSection}>
          <CameraView
            facing={facing}
            style={{ flex: 1 }}
            ref={camera}
            ratio="4:3"
          />
        </View>

        {/* Bottom Section - Controls */}
        <BottomButtonTab>

          <View style={{flex: 1, alignItems: "flex-end"}}>
            <TouchableOpacity onPress={handleChoosePhoto}>
              <Text style={styles.choosePhotoText}>Choose Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={{flex: 1, alignItems: "center"}}>
            <TouchableOpacity onPress={handleTakePhoto} style={styles.captureButton}>
              <Text style={styles.choosePhotoText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
          
          <View style={{flex: 1}} />

        </BottomButtonTab>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.mid_gray,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  topBar: {
    flex: 0.1,
    backgroundColor: Colors.dark_gray,
    justifyContent: "flex-end",
    paddingBottom: 15,
  },
  pinkButton: {
    alignSelf: "flex-start",
    borderRadius: 20,
    padding: 10,
    backgroundColor: Colors.pink,
    paddingHorizontal: 20,
    minWidth: 75,
  },
  cameraSection: {
    flex: 0.75,
    backgroundColor: Colors.pink,
    justifyContent: "center",
    padding: 10,
  },
  controlsSection: {
    flex: 0.15,
    backgroundColor: Colors.dark_gray,
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
    color: Colors.white,
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
    backgroundColor: Colors.white,
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
    backgroundColor: Colors.white,
  },
  placeholder: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  imageContainer: {
    height: '100%',
    width: 'auto',
    backgroundColor: Colors.white,
  },
});
