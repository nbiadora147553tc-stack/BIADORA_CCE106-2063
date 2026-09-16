import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const events = [
  {
    id: "1",
    title: "CCS General Assembly",
    category: "Academic",
    date: "September 20, 2026",
    time: "9:00 AM",
    location: "University Auditorium",
    description:
      "General assembly for Computer Studies students.",
  },
  {
    id: "2",
    title: "Intramurals Basketball",
    category: "Sports",
    date: "September 22, 2026",
    time: "2:00 PM",
    location: "University Gym",
    description:
      "Join the basketball games during the university intramurals.",
  },
  {
    id: "3",
    title: "Welcome Social Night",
    category: "Social",
    date: "September 25, 2026",
    time: "6:00 PM",
    location: "Student Center",
    description:
      "A fun social event for students to meet and connect.",
  },
  {
    id: "4",
    title: "React Native Workshop",
    category: "Workshop",
    date: "September 28, 2026",
    time: "10:00 AM",
    location: "Computer Laboratory",
    description:
      "Hands-on workshop about building mobile applications.",
  },
];

export default function EventDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const event = events.find(
    (item) => item.id === String(id)
  );

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Event Not Found</Text>

        <Text style={styles.description}>
          The event you are looking for does not exist.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.category}>
        {event.category}
      </Text>

      <Text style={styles.title}>
        {event.title}
      </Text>

      <Text style={styles.info}>
        📅 {event.date}
      </Text>

      <Text style={styles.info}>
        ⏰ {event.time}
      </Text>

      <Text style={styles.info}>
        📍 {event.location}
      </Text>

      <Text style={styles.heading}>
        Description
      </Text>

      <Text style={styles.description}>
        {event.description}
      </Text>

      <Pressable
        style={styles.button}
        onPress={() =>
          alert("You joined this event!")
        }
      >
        <Text style={styles.buttonText}>
          Join Event
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },

  category: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25,
  },

  info: {
    fontSize: 16,
    marginBottom: 12,
  },

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});