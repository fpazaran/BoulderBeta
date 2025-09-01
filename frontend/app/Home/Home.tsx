import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Climb } from "../../types/climb";
import { mock_climbs } from "../../mock_data/climbs";
import ClimbCard from "../components/ClimbCard";
import { Colors } from "../../assets/Colors";

type RootStackParamList = {
  Climb: { climb: Climb };
};

export default function Home() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const climbs = mock_climbs;

  // TODO: Replace with sorting logic
  const handleSort = () => {
    console.log("Sort");
  };

  // TODO: Replace with filter logic
  const handleFilter = () => {
    console.log("Filter");
  };

  const handlePressClimb = (climb: Climb) => {
    navigation.navigate("Climb", { climb });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topButton} onPress={handleSort}>
          <Text style={styles.topButtonText}>Sort</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topButton} onPress={handleFilter}>
          <Text style={styles.topButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Climb List */}
      <View style={styles.scrollContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {climbs.map((climb) => (
            <ClimbCard key={climb.id} climb={climb} card_color={Colors.yellow} image_color={Colors.light_yellow} handlePressClimb={handlePressClimb} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white
  },
  topBar: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    alignItems: "flex-end",
    paddingBottom: 10,
  },
  topButton: {
    backgroundColor: Colors.yellow,
    alignItems: "center",
    justifyContent: "center",
    height: 32,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 0.0,
  },
  topButtonText: {
    fontWeight: "bold",
    color: Colors.black,
    fontSize: 16,
  },
  scrollContainer: {
    flex: 15,
    marginBottom: 20,
  },
  scrollContent: {
  },
});
