import { Link, useRouter } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>PROJECT</Text>
        <Text style={styles.title}>Navigation connects screens into one application</Text>
        <Text style={styles.copy}>Explore a nested Tabs layout and open a course using a dynamic route.</Text>

        <Link href={{ pathname: "/courses/[courseId]", params: { courseId: "cce106" } }} style={styles.primaryLink}>
          Open CCE 106 course
        </Link>
        <Pressable style={styles.secondaryButton} onPress={() => router.push("/courses/cce206")}>
          <Text style={styles.secondaryText}>Open CCE 206 with router.push</Text>
        </Pressable>

        <View style={styles.grid}>
          <InfoCard title="Files" detail="Routes" />
          <InfoCard title="Layouts" detail="Relationships" />
          <InfoCard title="Links" detail="Destinations" />
          <InfoCard title="Router" detail="Actions" />
        </View>
      </View>
    </SafeAreaView>
  );
}

function InfoCard({ title, detail }: { title: string; detail: string }) {
  return <View style={styles.card}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.cardDetail}>{detail}</Text></View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FCFD" }, container: { flex: 1, padding: 24, paddingTop: 36 },
  eyebrow: { color: "#156F8A", fontSize: 11, fontWeight: "800", letterSpacing: 0.8 },
  title: { color: "#182235", fontSize: 30, fontWeight: "800", lineHeight: 37, marginTop: 18 },
  copy: { color: "#637080", fontSize: 16, lineHeight: 23, marginTop: 12, marginBottom: 28 },
  primaryLink: { backgroundColor: "#156F8A", borderRadius: 12, color: "#FFF", fontSize: 16, fontWeight: "700", overflow: "hidden", padding: 16, textAlign: "center" },
  secondaryButton: { alignItems: "center", borderColor: "#9FC6D0", borderRadius: 12, borderWidth: 1, marginTop: 12, padding: 15 }, secondaryText: { color: "#156F8A", fontWeight: "700" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 32 }, card: { backgroundColor: "#FFF", borderBottomColor: "#28A8C7", borderBottomWidth: 3, borderRadius: 10, elevation: 1, padding: 16, width: "47%" },
  cardTitle: { color: "#156F8A", fontSize: 16, fontWeight: "800" }, cardDetail: { color: "#687585", fontSize: 13, marginTop: 5 },
});
