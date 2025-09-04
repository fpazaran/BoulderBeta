import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import {
  RootStackNavigationProp,
  RootStackRouteProp,
} from "../../types/navigation";
import PhotoHoldView from "../components/Photo/PhotoHoldView";

export default function ClimbScreen() {
  const route = useRoute<RootStackRouteProp<"Climb">>();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { climb, source } = route.params;
  const [selectedHold, setSelectedHold] = useState<string | null>(null);
  
  // Get sequence order from holds
  const getSequenceOrder = () => {
    if (!climb.holds) return [];
    
    const sequenceMap = new Map();
    climb.holds.forEach(hold => {
      if (hold.nextHold) {
        sequenceMap.set(hold.id, hold.nextHold);
      }
    });
    
    // Find the first hold (one that isn't referenced as nextHold)
    const referencedHolds = new Set(Array.from(sequenceMap.values()));
    const firstHold = climb.holds.find(hold => !referencedHolds.has(hold.id));
    
    if (!firstHold) return [];
    
    // Build sequence array
    const sequence = [];
    let currentHoldId = firstHold.id;
    
    while (currentHoldId && sequence.length < climb.holds.length) {
      sequence.push(currentHoldId);
      currentHoldId = sequenceMap.get(currentHoldId);
    }
    
    return sequence;
  };
  
  const sequenceOrder = getSequenceOrder();
  
  const getCurrentHoldIndex = () => {
    if (!selectedHold) return -1;
    return sequenceOrder.indexOf(selectedHold);
  };
  
  const goToPreviousHold = () => {
    const currentIndex = getCurrentHoldIndex();
    if (currentIndex > 0) {
      setSelectedHold(sequenceOrder[currentIndex - 1]);
    }
  };
  
  const goToNextHold = () => {
    const currentIndex = getCurrentHoldIndex();
    if (currentIndex >= 0 && currentIndex < sequenceOrder.length - 1) {
      setSelectedHold(sequenceOrder[currentIndex + 1]);
    }
  };

  // Color scheme based on source
  const colors = {
    primary: source === "profile" ? "#90EE90" : "#fff86a",
    secondary: source === "profile" ? "#B8E6B8" : "#f3efb3",
    accent: source === "profile" ? "#00ff00" : "#ffe600",
  };

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
            <PhotoHoldView
              flex={0.9}
              image={typeof climb.image === 'string' ? climb.image : Image.resolveAssetSource(climb.image).uri}
              holds={climb.holds}
              setSelectedHoldID={setSelectedHold}
              isSequenceMode={sequenceOrder.length > 0}
              sequenceOrder={sequenceOrder}
              showArrows={true}
              selectedHoldID={selectedHold}
            />

            <View style={styles.selectedHoldSection}>
              {selectedHold ? (
                <>
                  {(() => {
                    const hold = climb.holds?.find((h) => h.id === selectedHold);
                    const currentIndex = getCurrentHoldIndex();
                    const isInSequence = currentIndex >= 0;
                    
                    return hold ? (
                      <View style={styles.holdDetailsContainer}>
                        <View style={styles.holdInfo}>
                          <Text style={styles.holdType}>
                            {hold.type || "Unknown Hold Type"}
                            {isInSequence && ` (${currentIndex + 1})`}
                          </Text>
                          {isInSequence && (
                            <Text style={styles.holdSequence}>
                              Step {currentIndex + 1} of {sequenceOrder.length}
                            </Text>
                          )}
                        </View>
                        
                        {isInSequence && sequenceOrder.length > 1 && (
                          <View style={styles.navigationButtons}>
                            <TouchableOpacity
                              style={[
                                styles.navButton,
                                currentIndex === 0 && styles.navButtonDisabled
                              ]}
                              onPress={goToPreviousHold}
                              disabled={currentIndex === 0}
                            >
                              <Text style={[
                                styles.navButtonText,
                                currentIndex === 0 && styles.navButtonTextDisabled
                              ]}>← Prev</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                              style={[
                                styles.navButton,
                                currentIndex === sequenceOrder.length - 1 && styles.navButtonDisabled
                              ]}
                              onPress={goToNextHold}
                              disabled={currentIndex === sequenceOrder.length - 1}
                            >
                              <Text style={[
                                styles.navButtonText,
                                currentIndex === sequenceOrder.length - 1 && styles.navButtonTextDisabled
                              ]}>Next →</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    ) : null;
                  })()}
                </>
              ) : (
                <Text style={styles.selectedHold}>
                  {sequenceOrder.length > 0 
                    ? "Tap a hold to navigate the sequence" 
                    : "Tap a hold to see details"
                  }
                </Text>
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
    justifyContent: "space-between",
  },
  imageSection: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedHoldSection: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    alignSelf: "center",
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
    textAlign: "center",
  },
  holdType: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    textAlign: "center",
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
  holdDetailsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  holdInfo: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    width: "100%",
  },
  holdSequence: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  navigationButtons: {
    flexDirection: "row",
    gap: 12,
  },
  navButton: {
    backgroundColor: "#ff0080",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 70,
    alignItems: "center",
  },
  navButtonDisabled: {
    backgroundColor: "#fff",
  },
  navButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  navButtonTextDisabled: {
    color: "#999",
  },
});
