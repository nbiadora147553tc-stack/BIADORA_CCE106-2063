import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { CampusEvent } from "../data/events";
type EventCardProps = { event: CampusEvent };
export function EventCard({ event }: EventCardProps) { return <Link href={`/event/${event.id}`} asChild><Pressable style={styles.card}><View style={styles.topRow}><Text style={styles.category}>{event.category}</Text><Text style={styles.date}>{event.date}</Text></View><Text style={styles.title}>{event.title}</Text><Text style={styles.detail}>{event.time}</Text><Text style={styles.detail}>{event.location}</Text></Pressable></Link>; }
const styles = StyleSheet.create({ card: { backgroundColor: "#FFFFFF", borderColor: "#DFE6F1", borderRadius: 18, borderWidth: 1, marginBottom: 12, padding: 17 }, category: { color: "#315C9A", fontSize: 12, fontWeight: "800", textTransform: "uppercase" }, date: { color: "#5E6B7E", fontSize: 12, fontWeight: "600", textAlign: "right" }, detail: { color: "#526176", fontSize: 14, marginTop: 5 }, title: { color: "#172033", fontSize: 18, fontWeight: "800", marginTop: 10 }, topRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" } });
