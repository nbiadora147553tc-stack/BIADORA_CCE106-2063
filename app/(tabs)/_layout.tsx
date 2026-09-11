import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const blue = "#156F8A";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerStyle: { backgroundColor: "#F8FCFD" },
      headerTintColor: "#182235",
      headerTitleStyle: { fontWeight: "700" },
      tabBarActiveTintColor: blue,
      tabBarInactiveTintColor: "#75808D",
      tabBarStyle: { borderTopColor: "#DDE7EA" },
    }}>
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} /> }} />
    </Tabs>
  );
}
