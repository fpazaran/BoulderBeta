import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Hold } from "../../types/climb";
import {
  RootStackNavigationProp,
  RootStackRouteProp,
} from "../../types/navigation";

export default function ClimbScreen() {
  const route = useRoute<RootStackRouteProp<"Climb">>();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { climb, source } = route.params;
  const [selectedHold, setSelectedHold] = useState<string | null>(null);
  const [holds, setHolds] = useState<Hold[]>([]);
  const [loading, setLoading] = useState(true);

  // Color scheme based on source
  const colors = {
    primary: source === "profile" ? "#90EE90" : "#fff86a",
    secondary: source === "profile" ? "#B8E6B8" : "#f3efb3",
    accent: source === "profile" ? "#00ff00" : "#ffe600",
  };

  // TODO: Replace with API call to fetch holds
  useEffect(() => {
    // Sample hold data - will be replaced with API call
    setHolds([
      {
        id: "1",
        type: "Crimp",
        nextHold: undefined,
        position: { top: 20, left: 30 },
        size: { width: 20, height: 20 },
      },
      {
        id: "2",
        type: "Sloper",
        nextHold: "1",
        position: { top: 40, left: 60 },
        size: { width: 20, height: 20 },
      },
      {
        id: "3",
        type: "Foothold",
        nextHold: "2",
        position: { top: 60, left: 20 },
        size: { width: 20, height: 20 },
      },
      {
        id: "4",
        type: "Jug",
        nextHold: "3",
        position: { top: 80, left: 70 },
        size: { width: 20, height: 20 },
      },
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.topButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.topButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Description */}
        <View style={styles.headerSection}>
          <Text style={styles.gymName}>{climb.gym.name}</Text>
          <View
            style={[styles.underline, { backgroundColor: colors.primary }]}
          />
          <Text style={styles.location}>{climb.gym.location}</Text>
          <Text style={styles.gradesTitle}>Grade: {climb.grade}</Text>
        </View>

        {/* Image/Hold Details */}
        <View style={styles.mainSection}>
          <View
            style={[
              styles.gradesContainer,
              { backgroundColor: colors.primary },
            ]}
          >
            <View style={styles.imageSection}>
              <View
                style={[
                  styles.imagePlaceholder,
                  { backgroundColor: colors.secondary },
                ]}
              >
                {holds.map((hold) => (
                  <TouchableOpacity
                    key={hold.id}
                    style={[
                      styles.hold,
                      {
                        top: `${hold.position.top}%`,
                        left: `${hold.position.left}%`,
                        backgroundColor:
                          selectedHold === hold.id ? "#ff0080" : "#333",
                        width: hold.size.width,
                        height: hold.size.height,
                      },
                    ]}
                    onPress={() =>
                      setSelectedHold(selectedHold === hold.id ? null : hold.id)
                    }
                  />
                ))}
              </View>
            </View>
            <View style={styles.selectedHoldSection}>
              <Text style={styles.selectedHold}>
                {selectedHold ? "" : "Tap a hold to see details"}
              </Text>
              {selectedHold && (
                <>
                  {(() => {
                    const hold = holds.find((h) => h.id === selectedHold);
                    const nextHold = hold?.nextHold
                      ? holds.find((h) => h.id === hold.nextHold)
                      : null;
                    return hold ? (
                      <>
                        <Text style={styles.holdType}>
                          Selected Hold: {hold.type}
                        </Text>
                        {nextHold && (
                          <TouchableOpacity
                            style={styles.nextHoldButton}
                            onPress={() => setSelectedHold(nextHold.id)}
                          >
                            <Text style={styles.nextHoldText}>Next</Text>
                          </TouchableOpacity>
                        )}
                      </>
                    ) : null;
                  })()}
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 0.0,
  },
  backButtonText: {
    fontSize: 18,
    color: "#ff0080",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerSection: {
    flex: 0.2,
    justifyContent: "flex-start",
  },
  mainSection: {
    flex: 0.8,
    justifyContent: "flex-start",
    marginTop: 10,
  },
  gymName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  gradesContainer: {
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 0.0,
    elevation: 5,
    flex: 1,
    flexDirection: "column",
  },
  imageSection: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedHoldSection: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    flexDirection: "row",
    gap: 10,
  },
  gradesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 0,
  },
  grade: {
    fontSize: 16,
    color: "#222",
    marginBottom: 8,
    paddingLeft: 8,
  },
  topButton: {
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginLeft: 8,
  },
  topButtonText: {
    fontWeight: "bold",
    color: "#222",
    fontSize: 16,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 12,
    marginTop: 48,
    gap: 10,
  },
  imagePlaceholder: {
    width: "90%",
    height: "90%",
    borderRadius: 16,
    position: "relative",
  },
  hold: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#fff",
  },
  underline: {
    height: 4,
    minWidth: 300,
    borderRadius: 2,
    marginBottom: 10,
  },
  selectedHold: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 0,
    marginRight: 10,
  },
  holdType: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  nextHoldButton: {
    backgroundColor: "#ff0080",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "center",
  },
  nextHoldText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
