import { SafeAreaView, StyleSheet, View, LayoutChangeEvent, ImageBackground } from "react-native";
import { Colors } from "../../../assets/Colors";
import TopButtonBar from "../TopBar";
import BottomButtonTab from "../BottomButtonTab";
import PinkButton from "../PinkButton";
import { useState } from "react";
import { useImageRatio } from '../../../utils/imageUtils';

export default function PhotoPreviewSection({
  photo, 
  handleRetake, 
  handlePredict, 
  handleCreate
} : {
  photo: string, 
  handleRetake: () => void, 
  handlePredict: () => void, 
  handleCreate: () => void
}) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const { imageSize, imageRatio } = useImageRatio(photo, containerSize, 0.95);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

    return (
        <SafeAreaView style={styles.photoPreview}>
            {/* top bar */}
            <TopButtonBar flex={0.1}>
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <PinkButton title="Retake" onPress={handleRetake} styles={{width: "80%", height: "20%", marginVertical: 20}}/>
                </View>
                <View style={{flex: 2}} />
            </TopButtonBar>

            {/* image */}
            <View style={{flex: 0.75, justifyContent: "center", alignItems: "center", backgroundColor: Colors.pink}} onLayout={onLayout}>
                <ImageBackground
                    source={{ uri: photo }} 
                    style={{ 
                        width: imageSize.width * imageRatio, 
                        height: imageSize.height * imageRatio
                    }} 
                    resizeMode="contain"
                />
            </View>

            {/* bottom button tab */}
            <BottomButtonTab flex={0.15}>
                <View style={styles.placeholderBottom} />

                {/* predict button */}
                <View style={{flex: 10, justifyContent: "center", alignItems: "center"}}>
                    <View style={{width: "70%", height: "40%"}}>
                        <PinkButton title="Predict" onPress={handlePredict} />
                    </View>
                </View>
                
                <View style={styles.placeholderBottom} />

                {/* create button */}
                <View style={{flex: 10, justifyContent: "center", alignItems: "center"}}>
                    <View style={{width: "70%", height: "40%"}}>
                        <PinkButton title="Create" onPress={handleCreate} />
                    </View>
                </View>

                <View style={styles.placeholderBottom} />
            </BottomButtonTab>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    photoPreview: {
        flex: 1,
        backgroundColor: Colors.mid_gray,
    },
    photoPreviewImage: {
        flex: 0.75,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.pink,
    },
    placeholderBottom: {
        flex: 1,
        backgroundColor: Colors.red,
    },
});