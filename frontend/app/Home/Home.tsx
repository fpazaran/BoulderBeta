import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Climb } from "../../types/climb";

type RootStackParamList = {
  Climb: { climb: Climb };
};

// TODO: Replace with actual climb data
const climbs: Climb[] = [
  {
    id: 1,
    grade: "V5-7",
    gym: {
      id: 1,
      name: "Seattle Bouldering Project - U District",
      location: "Seattle, WA",
    },
  },
  {
    id: 2,
    grade: "V6",
    gym: {
      id: 1,
      name: "Seattle Bouldering Project - Poplar",
      location: "Seattle, WA",
    },
  },
  {
    id: 3,
    grade: "V4-6",
    gym: {
      id: 2,
      name: "Stone Gardens - Ballard",
      location: "Seattle, WA",
    },
  },
  {
    id: 4,
    grade: "V7",
    gym: {
      id: 2,
      name: "Stone Gardens - Ballard",
      location: "Seattle, WA",
    },
  },
];

export default function Home() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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
            <TouchableOpacity
              key={climb.id}
              style={styles.card}
              onPress={() => handlePressClimb(climb)}
            >
              <View style={styles.imagePlaceholder} />
              <View style={styles.cardContent}>
                <View style={styles.gymNameContainer}>
                  <Text style={styles.gymName}>{climb.gym.name}</Text>
                </View>
                <Text style={styles.gymGrade}>Grade: {climb.grade}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#222",
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
    backgroundColor: "#fff86a",
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
    color: "#222",
    fontSize: 16,
  },
  scrollContainer: {
    flex: 15,
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff86a",
    borderRadius: 18,
    marginVertical: 8,
    padding: 12,
    minHeight: 180,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
  },
  imagePlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 16,
    backgroundColor: "#f3efb3",
    marginRight: 18,
  },
  cardContent: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  gymNameContainer: {
    borderBottomWidth: 2,
    borderBottomColor: "#222",
    marginBottom: 10,
    paddingBottom: 2,
    alignSelf: "stretch",
  },
  gymName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#111",
  },
  gymGrade: {
    fontSize: 13,
    color: "#222",
    fontWeight: "normal",
    marginBottom: 6,
    marginTop: 2,
  },
  gymLocation: {
    fontSize: 12,
    color: "#666",
    fontWeight: "normal",
    marginBottom: 8,
    marginTop: 2,
  },
});
