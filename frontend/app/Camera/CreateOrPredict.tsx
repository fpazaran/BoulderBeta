import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, PanResponder } from "react-native";
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { useRef, useState } from "react";
import { Hold, Tool } from "@/types/climb";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

type RootStackParamList = {
    CreateOrPredict: { image: string, create: boolean };
};

type CreateOrPredictScreenRouteProp = RouteProp<RootStackParamList, 'CreateOrPredict'>;

export default function CreateOrPredict() {
  const route = useRoute<CreateOrPredictScreenRouteProp>();
  const { image, create } = route.params;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [holds, setHolds] = useState<Hold[]>([]);
  const [tool, setTool] = useState<Tool>('rectangle');
  const [selectedHoldId, setSelectedHoldId] = useState<string | null>(null);
  const imageRef = useRef<Image>(null);

  const colors = {
    selected: '#ff0080',
    unselected: '#fff',
  }

  const toolSize = 40;

  const handleCancel = () => {
    navigation.goBack();
  }

  const handleCreate = () => {
    console.log('Created route');
  }

  const handlePredict = () => {
    console.log('Predicting route');
  }

  const handleAddHold = (hold: Hold) => {
    setHolds([...holds, hold]);
  }

  const handleChangeTool = (tool: Tool) => {
    setTool(tool);
    setSelectedHoldId(null);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Top Section - Top Bar */}
        <View style={styles.topBar}>
          {image ? 
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.pinkButton} onPress={handleCancel}>
              <Text style={styles.choosePhotoText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pinkButton} onPress={create ? handleCreate : handlePredict}>
              <Text style={styles.choosePhotoText}>{create ? 'Create' : 'Predict'}</Text>
            </TouchableOpacity>
          </View>
          : null}
        </View>
        
        {/* Middle Section - Camera View */}
        <View style={styles.cameraSection}>
          <Image source={{uri: image}} style={{flex: 1}} ref={imageRef}/>
        </View>

        {/* Bottom Section - Controls */}
        <View style={styles.controlsSection}>
          {create ? 
            <View style={styles.cameraControls}>
            
            <TouchableOpacity style={styles.toolButton} onPress={() => handleChangeTool('rectangle')}>
              <MaterialIcons 
                  name="crop-square" 
                  size={toolSize} 
                  color={tool === 'rectangle' ? colors.selected : colors.unselected} 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolButton} onPress={() => handleChangeTool('select')}>
              <MaterialIcons 
                  name="timeline" 
                  size={toolSize} 
                  color={tool === 'select' ? colors.selected : colors.unselected} 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolButton} onPress={() => handleChangeTool('delete')}>
              <Ionicons 
                  name="trash-outline" 
                  size={toolSize} 
                  color={tool === 'delete' ? colors.selected : colors.unselected} 
                />
              </TouchableOpacity>
            
            </View>
           :
          <View style={styles.controlsSection}>
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.toolButton} onPress={() => setTool('rectangle')}>
            <MaterialIcons 
                name="crop-square" 
                size={toolSize} 
                color={tool === 'rectangle' ? colors.selected : colors.unselected} 
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolButton} onPress={() => setTool('delete')}>
            <Ionicons 
                name="trash-outline" 
                size={toolSize} 
                color={tool === 'delete' ? colors.selected : colors.unselected} 
              />
            </TouchableOpacity>
          </View>
          </View>
          }
          
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#111',
    },
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    topBar: {
      flex: 0.10,
      backgroundColor: '#111',
      justifyContent: 'flex-end',
      paddingBottom: 15,
    },
    pinkButton: {
      alignSelf: 'flex-start',
      borderRadius: 20,
      padding: 10,
      backgroundColor: '#ff0080',
      paddingHorizontal: 20,
      minWidth: 75,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 40,
    },
    cameraSection: {
      flex: 0.75,
      position: 'relative',
    },
    controlsSection: {
      flex: 0.15,
      backgroundColor: '#111',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cameraControls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '85%',
    },
    choosePhotoText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'center',
    },
    toolButton: {
      borderRadius: 10,
      padding: 0,
      backgroundColor: '#000000',
      alignItems: 'center',
      justifyContent: 'center',
      width: 60,
      height: 60,
      marginHorizontal: 10,
    },
    toolButtonSelected: {
      backgroundColor: '#222',
      borderWidth: 2,
      borderColor: '#ff0080',
    }
  });