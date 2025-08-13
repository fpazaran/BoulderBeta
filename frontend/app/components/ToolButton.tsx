import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Tool } from "../../types/climb";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function ToolButton({tool, handleChangeTool, toolSize = 40}: {tool: Tool, handleChangeTool: (tool: Tool) => void, toolSize?: number}) {
    const colors = {
        selected: "#ff0080",
        unselected: "#fff",
    };
    
    if (tool === "rectangle") {
        return (
            <TouchableOpacity
                style={styles.toolButton}
                onPress={() => handleChangeTool("rectangle")}
              >
                <MaterialIcons
                  name="crop-square"
                  size={toolSize}
                  color={
                    tool === "rectangle" ? colors.selected : colors.unselected
                  }
                />
              </TouchableOpacity>
        );
    }

    if (tool === "delete") {
        return (
            <TouchableOpacity
                style={styles.toolButton}
                onPress={() => handleChangeTool("delete")}
              >
                <Ionicons
                  name="trash-outline"
                  size={toolSize}
                  color={
                    tool === "delete" ? colors.selected : colors.unselected
                  }
                />
            </TouchableOpacity>
        );
    }

    if (tool === "move") {
        return (
            <TouchableOpacity
                style={styles.toolButton}
                onPress={() => handleChangeTool("move")}
              >
                <MaterialIcons
                  name="timeline"
                  size={toolSize}
                  color={
                    tool === "move" ? colors.selected : colors.unselected
                  }
                />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
  toolButton: {
    borderRadius: 10,
    padding: 0,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
  },
});