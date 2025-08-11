import { Image, SafeAreaView, StyleSheet, View, LayoutChangeEvent, Text } from "react-native";
import { Colors } from "../../assets/Colors";
import TopButtonBar from "./TopButtonBar";
import BottomButtonTab from "./BottomButtonTab";
import PinkButton from "./PinkButton";
import { useEffect, useState } from "react";

export default function PhotoPreviewSection({photo, handleRetake, handlePredict, handleCreate} : {photo: string, handleRetake: () => void, handlePredict: () => void, handleCreate: () => void}) {
    const [imageSize, setImageSize] = useState({width: 0, height: 0});
    const [imageRatio, setImageRatio] = useState(1);
    const [containerSize, setContainerSize] = useState({width: 0, height: 0});

    const scale = 1;
    const scaleByHeight = false;

    useEffect(() => {
        console.log("Loading image size for photo:", photo);
        Image.getSize(photo, (width, height) => {
            console.log("Image size loaded:", { width, height });
            setImageSize({width, height});
        }, (error) => {
            console.error("Error getting image size:", error);
        });
    }, [photo]);

    useEffect(() => {
        // Calculate ratio only when both container and image sizes are available
        if (containerSize.height > 0 && imageSize.height > 0) {
            const ratio = scaleByHeight ? (scale * containerSize.height) / imageSize.height : (scale * containerSize.width) / imageSize.width;
            console.log('Container size:', containerSize);
            console.log('Image size:', imageSize);
            console.log('New ratio calculated:', ratio);
            console.log('New dimensions:', {
                width: ratio * imageSize.width,
                height: ratio * imageSize.height
            });
            setImageRatio(ratio);
        }
    }, [containerSize, imageSize, scale]);
    
    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        console.log('Container dimensions:', width, height);
        setContainerSize({width, height});
    };

    return (
        <SafeAreaView style={styles.photoPreview}>
            {/* top bar */}
            <TopButtonBar flex={0.15}>
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <View style={{width: "80%", height: "30%"}}>
                        <PinkButton title="Retake" onPress={handleRetake} />
                    </View>
                </View>
                <View style={{flex: 2}} />
            </TopButtonBar>

            {/* image */}
            <View style={styles.photoPreviewImage} onLayout={onLayout}>
                <Image 
                    source={{ uri: photo }} 
                    style={{ 
                        width: imageSize.width * imageRatio, 
                        height: imageSize.height * imageRatio
                    }} 
                    resizeMode="contain"
                />
            </View>

            <BottomButtonTab>
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
        backgroundColor: Colors.black,
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