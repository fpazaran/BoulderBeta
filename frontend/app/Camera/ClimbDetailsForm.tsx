import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/assets/Colors";
import TopBar from "../components/TopBar";
import { RootStackNavigationProp, RootStackRouteProp } from "@/types/navigation";
import { useNavigation, useRoute } from "@react-navigation/native";
import PinkButton from "../components/PinkButton";
import PhotoHoldView from "../components/Photo/PhotoHoldView";
import { Hold } from "@/types/climb";
import { useState } from "react";

export default function ClimbDetailsFormScreen() {
  const route = useRoute<RootStackRouteProp<"ClimbDetailsForm">>();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { image, holds: initialHolds } = route.params;
  const [selectedHoldID, setSelectedHoldID] = useState<string | null>(null);
  const [holds, setHolds] = useState<Hold[]>(initialHolds);

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Section - Top Bar */}
      <TopBar flex={0.1}>
        <View style={{flex: 1, paddingHorizontal: 60, paddingVertical: 20, alignItems: "flex-start"}}>
          <PinkButton title="Cancel" onPress={handleCancel}></PinkButton>
        </View>
        <View style={{flex: 1}}/>
      </TopBar>
      {/* Hold Preview/Labeling Section */}
      <PhotoHoldView flex={0.7} image={image} holds={holds} setHolds={setHolds} setSelectedHoldID={setSelectedHoldID} />

      {/* Form Section */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.mid_gray,
  },
});
