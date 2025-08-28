import {
  View,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Hold } from "@/types/climb";
import {
  RootStackNavigationProp,
  RootStackRouteProp,
} from "@/types/navigation";
import PhotoAnnotator from "../components/Photo/PhotoAnnotator";
import PinkButton from "../components/PinkButton";
import { Colors } from "@/assets/Colors";
import TopBar from "../components/TopBar";

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

  const handleSetHolds = (holds: Hold[]) => {
    setHolds(holds);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        {/* Top Section - Top Bar */}
        <TopBar>
          <View style={styles.button}>
            <PinkButton title="Cancel" onPress={handleCancel} />
          </View>
          <View style={styles.button}>
            <PinkButton title={create ? "Create" : "Predict"} onPress={() => {create ? handleCreate() : handlePredict();}} />
          </View>
        </TopBar>

        {/* annotator */}
        <PhotoAnnotator handleSetHolds={handleSetHolds} image={image} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.mid_gray,
  },
  topBar: {
    flexDirection: "row",
    flex: 0.1,
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
