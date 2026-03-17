import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { AuthContext } from '../Contexts/AuthContext';

const FLASH_PEAK_OPACITY = 0.4;
const FLASH_RISE_MS = 80;
const FLASH_FADE_MS = 170;

export default function ScanSuccessFlashOverlay() {
  const { scanSuccessFlashTrigger, setScanSuccessFlashTrigger } =
    React.useContext(AuthContext);
  const opacity = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  useEffect(() => {
    if (!scanSuccessFlashTrigger || scanSuccessFlashTrigger <= 0) return;
    if (isAnimating.current) return;

    isAnimating.current = true;
    opacity.setValue(0);

    Animated.sequence([
      Animated.timing(opacity, {
        toValue: FLASH_PEAK_OPACITY,
        duration: FLASH_RISE_MS,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: FLASH_FADE_MS,
        useNativeDriver: true,
      }),
    ]).start(() => {
      opacity.setValue(0);
      isAnimating.current = false;
      setScanSuccessFlashTrigger(0);
    });
  }, [scanSuccessFlashTrigger, opacity, setScanSuccessFlashTrigger]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.overlay, { opacity }]}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00c864',
  },
});
