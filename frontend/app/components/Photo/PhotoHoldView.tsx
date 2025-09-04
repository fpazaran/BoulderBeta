import React from "react";
import { View, ImageBackground, LayoutChangeEvent, StyleSheet, Text } from "react-native";
import { Hold } from "@/types/climb";
import { useState } from "react";
import Svg, { Line, Polygon } from "react-native-svg";
import PinkRectangle from "../PinkRectangle";
import { Colors } from "../../../assets/Colors";
import { useImageRatio } from '../../../utils/imageUtils';

export default function PhotoHoldView({
  image,
  holds,
  flex = 0.6,
  setHolds = () => {},
  setSelectedHoldID,
  backgroundColor = Colors.white,
  borderRadius = 10,
  isSequenceMode = false,
  sequenceOrder = [],
  onHoldSelect,
  showArrows = false,
  selectedHoldID = null
}: {
  image: any;
  holds?: Hold[];
  flex?: number;
  setHolds?: (holds: Hold[]) => void;
  setSelectedHoldID: (id: string | null) => void;
  backgroundColor?: string;
  borderRadius?: number;
  isSequenceMode?: boolean;
  sequenceOrder?: string[];
  onHoldSelect?: (holdId: string) => void;
  showArrows?: boolean;
  selectedHoldID?: string | null;
}) {
  const [selectedHold, setSelectedHold] = useState<Hold | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const { imageSize, imageRatio } = useImageRatio(image, containerSize, 0.95);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  return (
    <View style={[styles.container, { flex: flex, backgroundColor: backgroundColor, borderRadius: borderRadius }]} onLayout={onLayout}>
      <ImageBackground
        source={{ uri: image }}
        resizeMode="contain"
        style={{
          width: imageSize.width * imageRatio,
          height: imageSize.height * imageRatio,
        }}
      >
        <Svg style={{ width: imageSize.width * imageRatio, height: imageSize.height * imageRatio }}>
          {selectedHold && (
            <PinkRectangle
              onPress={() => {
                setSelectedHoldID(null);
              }}
              x={selectedHold.position.left * imageRatio}
              y={selectedHold.position.top * imageRatio}
              width={selectedHold.size.width * imageRatio}
              height={selectedHold.size.height * imageRatio}
            />
          )}
          {holds && holds.map((hold) => {
            const sequenceIndex = sequenceOrder.indexOf(hold.id);
            const isInSequence = sequenceIndex !== -1;
            
            return (
              <PinkRectangle
                onPress={() => {
                  if (onHoldSelect) {
                    onHoldSelect(hold.id);
                  } else {
                    setSelectedHoldID(hold.id);
                  }
                }}
                key={hold.id}
                x={hold.position.left * imageRatio}
                y={hold.position.top * imageRatio}
                width={hold.size.width * imageRatio}
                height={hold.size.height * imageRatio}
                opacity={isSequenceMode && !isInSequence ? 0.3 : 1}
              />
            );
          })}
          
          {/* Sequence arrows */}
          {showArrows && selectedHoldID && holds && (() => {
            const currentHold = holds.find(h => h.id === selectedHoldID);
            if (!currentHold || !currentHold.nextHold) return null;
            
            const nextHold = holds.find(h => h.id === currentHold.nextHold);
            if (!nextHold) return null;
            
            const hold = currentHold;
            
            // Calculate center points of current and next holds
            const fromX = (hold.position.left + hold.size.width / 2) * imageRatio;
            const fromY = (hold.position.top + hold.size.height / 2) * imageRatio;
            const toX = (nextHold.position.left + nextHold.size.width / 2) * imageRatio;
            const toY = (nextHold.position.top + nextHold.size.height / 2) * imageRatio;
            
            // Calculate arrow direction
            const dx = toX - fromX;
            const dy = toY - fromY;
            const length = Math.sqrt(dx * dx + dy * dy);
            
            if (length === 0) return null;
            
            // Normalize direction
            const unitX = dx / length;
            const unitY = dy / length;
            
            // Adjust start and end points to not overlap with holds
            const holdRadius = 20;
            const adjustedFromX = fromX + unitX * holdRadius;
            const adjustedFromY = fromY + unitY * holdRadius;
            const adjustedToX = toX - unitX * holdRadius;
            const adjustedToY = toY - unitY * holdRadius;
            
            // Calculate arrowhead points
            const arrowLength = 15;
            const arrowAngle = Math.PI / 6; // 30 degrees
            
            const arrowX1 = adjustedToX - arrowLength * Math.cos(Math.atan2(dy, dx) - arrowAngle);
            const arrowY1 = adjustedToY - arrowLength * Math.sin(Math.atan2(dy, dx) - arrowAngle);
            const arrowX2 = adjustedToX - arrowLength * Math.cos(Math.atan2(dy, dx) + arrowAngle);
            const arrowY2 = adjustedToY - arrowLength * Math.sin(Math.atan2(dy, dx) + arrowAngle);
            
            // Calculate where the line should end (at the base of the triangle)
            const triangleBaseDistance = 8; // Distance from arrow tip to where line should end
            const lineEndX = adjustedToX - triangleBaseDistance * Math.cos(Math.atan2(dy, dx));
            const lineEndY = adjustedToY - triangleBaseDistance * Math.sin(Math.atan2(dy, dx));
            
            return (
              <React.Fragment key={`arrow-${hold.id}`}>
                {/* Arrow line */}
                <Line
                  x1={adjustedFromX}
                  y1={adjustedFromY}
                  x2={lineEndX}
                  y2={lineEndY}
                  stroke="#ff0080"
                  strokeWidth="4"
                />
                
                {/* Arrowhead */}
                <Polygon
                  points={`${adjustedToX},${adjustedToY} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
                  fill="#ff0080"
                />
              </React.Fragment>
            );
          })()}
        </Svg>
        
        {/* Sequence number overlays */}
        {isSequenceMode && holds && holds.map((hold) => {
          const sequenceIndex = sequenceOrder.indexOf(hold.id);
          if (sequenceIndex === -1) return null;
          
          const centerX = (hold.position.left + hold.size.width / 2) * imageRatio;
          const centerY = (hold.position.top + hold.size.height / 2) * imageRatio;
          
          return (
            <View
              key={`sequence-${hold.id}`}
              style={[
                styles.sequenceNumber,
                {
                  left: centerX - 15,
                  top: centerY - 15,
                }
              ]}
              pointerEvents="none"
            >
              <Text style={styles.sequenceNumberText}>
                {sequenceIndex + 1}
              </Text>
            </View>
          );
        })}

        {/* Hold type indicators */}
        {!isSequenceMode && holds && holds.map((hold) => {
          if (!hold.type) return null;
          
          const centerX = (hold.position.left + hold.size.width / 2) * imageRatio;
          const centerY = (hold.position.top + hold.size.height / 2) * imageRatio;
          
          const getHoldTypeEmoji = (type: string) => {
            const emojiMap: { [key: string]: string } = {
              'Crimp': '🤏',
              'Jug': '✊',
              'Sloper': '🤲',
              'Pinch': '👌',
              'Sidepull': '👈',
              'Undercling': '👆',
              'Foothold': '🦶',
            };
            return emojiMap[type] || '🪨';
          };
          
          return (
            <View
              key={`type-${hold.id}`}
              style={[
                styles.holdTypeIndicator,
                {
                  left: centerX - 15,
                  top: centerY - 15,
                }
              ]}
              pointerEvents="none"
            >
              <Text style={styles.holdTypeEmoji}>
                {getHoldTypeEmoji(hold.type)}
              </Text>
            </View>
          );
        })}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  sequenceNumber: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ff0080",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  sequenceNumberText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  holdTypeIndicator: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  holdTypeEmoji: {
    fontSize: 16,
    textAlign: "center",
  },
});