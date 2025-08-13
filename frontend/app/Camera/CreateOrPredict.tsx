import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Hold, Tool } from "@/types/climb";
import {
  RootStackNavigationProp,
  RootStackRouteProp,
} from "@/types/navigation";
import PhotoAnnotator from "../components/PhotoAnnotator";
import PinkButton from "../components/PinkButton";

export default function CreateOrPredict() {
  const route = useRoute<RootStackRouteProp<"CreateOrPredict">>();
  const { image, create } = route.params;
  const navigation = useNavigation<RootStackNavigationProp>();
  const [holds, setHolds] = useState<Hold[]>([]);

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleCreate = () => {
    navigation.navigate("ClimbDetailsForm", { 
      holds: holds,
      image: image,
    }); 
  };

  const handlePredict = () => {
    navigation.navigate("Prediction", { holds: holds });
    console.log("Predicting route");
  };

  const handleAddHold = (hold: Hold) => {
    setHolds([...holds, hold]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        {/* Top Section - Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.button}>
            <PinkButton title="Cancel" onPress={handleCancel} />
          </View>
          <View style={styles.button}>
            <PinkButton title={create ? "Create" : "Predict"} onPress={() => {create ? handleCreate() : handlePredict();}} />
          </View>
        </View>

        {/* annotator */}
        <PhotoAnnotator handleAddHold={handleAddHold} image={image} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111",
  },
  topBar: {
    flexDirection: "row",
    flex: 0.1,
    backgroundColor: "#111",
    justifyContent: "flex-end",
    paddingBottom: 15,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  }
});
