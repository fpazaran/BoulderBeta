import { View, Text } from "react-native";
import { RootStackRouteProp } from "@/types/navigation";
import { useRoute } from "@react-navigation/native";

// TODO: Implement climb form
export default function ClimbDetailsForm() {
  const route = useRoute<RootStackRouteProp<"ClimbDetailsForm">>();
  const { holds } = route.params;

  return (
    <View>
      <Text>ClimbForm</Text>
    </View>
  );
}
