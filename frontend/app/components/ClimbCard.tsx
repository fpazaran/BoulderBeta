import { StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";
import { Climb } from "@/types/climb";

export default function ClimbCard({ climb, card_color, image_color, handlePressClimb, handleLongPressClimb, margin_horizontal = 15 }: { climb: Climb, card_color: string, image_color: string, handlePressClimb: (climb: Climb) => void, handleLongPressClimb?: (climb: Climb) => void, margin_horizontal?: number }   ) {
  return (
    <TouchableOpacity
              key={climb.id}
              style={[styles.card, { backgroundColor: card_color, marginHorizontal: margin_horizontal }]}
              onPress={() => handlePressClimb(climb)}
              onLongPress={() => handleLongPressClimb?.(climb)}
            >
              <Image source={climb.image} style={[styles.imagePlaceholder, { backgroundColor: image_color }]}  resizeMode="cover"/>
              <View style={styles.cardContent}>
                <View style={styles.gymNameContainer}>
                  <Text style={styles.gymName}>{climb.gym.name}</Text>
                </View>
                <Text style={styles.gymGrade}>Grade: {climb.grade}</Text>
              </View>
            </TouchableOpacity> 
  );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
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
