import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

type CounterAppProps = {
  increment?: number;
};

export default function CounterApp({ increment = 1 }: CounterAppProps) {
  const [count, setCount] = useState(0);
  const step = increment > 0 ? increment : 1;

  const increaseCount = () => {
    setCount((currentCount) => currentCount + step);
  };

  const decreaseCount = () => {
    setCount((currentCount) => Math.max(0, currentCount - step));
  };

  const resetCount = () => {
    setCount(0);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Counter App</Text>
        <Text style={styles.label}>Current value</Text>
        <Text accessibilityLiveRegion="polite" style={styles.count}>{count}</Text>

        <View style={styles.controls}>
          <Pressable accessibilityLabel={"Decrease counter by " + step} accessibilityRole="button" disabled={count === 0} onPress={decreaseCount} style={({ pressed }) => [styles.button, styles.decreaseButton, (pressed || count === 0) && styles.buttonPressed]}>
            <Text style={[styles.buttonText, styles.decreaseText]}>?</Text>
          </Pressable>
          <Pressable accessibilityLabel={"Increase counter by " + step} accessibilityRole="button" onPress={increaseCount} style={({ pressed }) => [styles.button, styles.increaseButton, pressed && styles.buttonPressed]}>
            <Text style={styles.buttonText}>+</Text>
          </Pressable>
        </View>

        <Pressable accessibilityRole="button" onPress={resetCount} style={({ pressed }) => [styles.resetButton, pressed && styles.buttonPressed]}>
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
        <Text style={styles.hint}>Step: {step}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F4F7FB" },
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { color: "#172033", fontSize: 30, fontWeight: "800" },
  label: { color: "#697586", fontSize: 16, marginTop: 34 },
  count: { color: "#244C9A", fontSize: 88, fontVariant: ["tabular-nums"], fontWeight: "800", marginVertical: 8 },
  controls: { flexDirection: "row", gap: 14, marginTop: 18 },
  button: { alignItems: "center", borderRadius: 16, height: 64, justifyContent: "center", width: 104 },
  decreaseButton: { backgroundColor: "#DCE7FA" },
  increaseButton: { backgroundColor: "#244C9A" },
  buttonText: { color: "#FFFFFF", fontSize: 34, fontWeight: "700" },
  decreaseText: { color: "#244C9A" },
  buttonPressed: { opacity: 0.6, transform: [{ scale: 0.97 }] },
  resetButton: { borderColor: "#AAB7CE", borderRadius: 10, borderWidth: 1, marginTop: 20, paddingHorizontal: 24, paddingVertical: 12 },
  resetText: { color: "#34415A", fontSize: 15, fontWeight: "700" },
  hint: { color: "#697586", fontSize: 13, marginTop: 16 },
});
