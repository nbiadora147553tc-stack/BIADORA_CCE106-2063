import { StyleSheet, Text, View } from "react-native";
type StatCardProps = { title: string; value: string | number };
export function StatCard({ title, value }: StatCardProps) { return <View style={styles.card}><Text style={styles.value}>{value}</Text><Text style={styles.title}>{title}</Text></View>; }
const styles = StyleSheet.create({ card: { backgroundColor: "#E8F1FF", borderRadius: 18, flex: 1, minWidth: 140, padding: 18 }, title: { color: "#40506A", fontSize: 14, fontWeight: "600", marginTop: 5 }, value: { color: "#123A70", fontSize: 30, fontWeight: "800" } });
