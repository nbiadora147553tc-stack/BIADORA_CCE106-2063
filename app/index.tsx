import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Task = {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
};

const initialTasks: Task[] = [
  { id: "1", title: "Review database normalization", dueDate: "Sep 05", completed: false },
  { id: "2", title: "Finish mobile UI activity", dueDate: "Sep 08", completed: false },
  { id: "3", title: "Submit weekly reflection", dueDate: "Sep 01", completed: true },
];

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [feedback, setFeedback] = useState("Ready when you are.");

  const { pending, completed } = useMemo(
    () => ({
      pending: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length,
    }),
    [tasks],
  );

  const addTask = () => {
    const cleanTitle = title.trim();
    const cleanDueDate = dueDate.trim();

    if (!cleanTitle || !cleanDueDate) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setFeedback("Add both a task title and due date first.");
      return;
    }

    setTasks((currentTasks) => [
      { id: Date.now().toString(), title: cleanTitle, dueDate: cleanDueDate, completed: false },
      ...currentTasks,
    ]);
    setTitle("");
    setDueDate("");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setFeedback(`“${cleanTitle}” was added to your task list.`);
  };

  const toggleTask = (id: string) => {
    let completedNow = false;
    let taskTitle = "Task";
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== id) return task;
        completedNow = !task.completed;
        taskTitle = task.title;
        return { ...task, completed: completedNow };
      }),
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFeedback(`${taskTitle} marked ${completedNow ? "complete" : "incomplete"}.`);
  };

  const deleteTask = (id: string, taskTitle: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setFeedback(`${taskTitle} was deleted.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <View>
                  <Text style={styles.eyebrow}>STUDENT DASHBOARD</Text>
                  <Text style={styles.greeting}>Hello, Nazvil</Text>
                </View>
                <View style={styles.avatar}><Text style={styles.avatarText}>NB</Text></View>
              </View>
              <View style={styles.profileCard}>
                <Text style={styles.profileName}>Nazvil Biadora</Text>
                <View style={styles.profileDetails}>
                  <Text style={styles.profileDetail}>BSIT · 3rd year</Text>
                  <Text style={styles.studentId}>ID 147553</Text>
                </View>
              </View>
              <View style={styles.statsRow}>
                <View style={[styles.statCard, styles.pendingCard]}>
                  <View style={styles.statIcon}><Ionicons name="time-outline" size={18} color="#8B5E00" /></View>
                  <Text style={styles.statNumber}>{pending}</Text><Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={[styles.statCard, styles.completedCard]}>
                  <View style={[styles.statIcon, styles.completedIcon]}><Ionicons name="checkmark" size={18} color="#137A50" /></View>
                  <Text style={styles.statNumber}>{completed}</Text><Text style={styles.statLabel}>Completed</Text>
                </View>
              </View>
              <View style={styles.formCard}>
                <Text style={styles.sectionTitle}>Add a task</Text>
                <Text style={styles.formHint}>Keep your next deadline in sight.</Text>
                <TextInput value={title} onChangeText={setTitle} placeholder="Task title" placeholderTextColor="#89939E" style={styles.input} returnKeyType="next" />
                <TextInput value={dueDate} onChangeText={setDueDate} placeholder="Due date (e.g. Sep 12)" placeholderTextColor="#89939E" style={styles.input} returnKeyType="done" onSubmitEditing={addTask} />
                <Pressable accessibilityRole="button" accessibilityLabel="Add task" onPress={addTask} style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
                  <Ionicons name="add" size={21} color="#FFFFFF" /><Text style={styles.addButtonText}>Add task</Text>
                </Pressable>
                <View style={styles.feedback} accessibilityLiveRegion="polite">
                  <Ionicons name="information-circle-outline" size={16} color="#57636E" /><Text style={styles.feedbackText}>{feedback}</Text>
                </View>
              </View>
              <View style={styles.listHeading}><Text style={styles.sectionTitle}>Current tasks</Text><Text style={styles.taskCount}>{tasks.length} total</Text></View>
            </>
          }
          renderItem={({ item }) => (
            <View style={[styles.taskCard, item.completed && styles.taskCardCompleted]}>
              <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: item.completed }} accessibilityLabel={`Mark ${item.title} ${item.completed ? "incomplete" : "complete"}`} onPress={() => toggleTask(item.id)} hitSlop={6} style={({ pressed }) => [styles.checkButton, pressed && styles.iconPressed]}>
                <Ionicons name={item.completed ? "checkmark-circle" : "ellipse-outline"} size={29} color={item.completed ? "#1A9A66" : "#71808C"} />
              </Pressable>
              <Pressable onPress={() => toggleTask(item.id)} style={({ pressed }) => [styles.taskDetails, pressed && styles.detailsPressed]}>
                <Text style={[styles.taskTitle, item.completed && styles.taskTitleCompleted]}>{item.title}</Text>
                <View style={styles.dueRow}><Ionicons name="calendar-outline" size={14} color="#697783" /><Text style={styles.dueText}>Due {item.dueDate}</Text></View>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${item.title}`} onPress={() => deleteTask(item.id, item.title)} hitSlop={5} style={({ pressed }) => [styles.deleteButton, pressed && styles.iconPressed]}>
                <Ionicons name="trash-outline" size={20} color="#B74848" />
              </Pressable>
            </View>
          )}
          ListEmptyComponent={<View style={styles.emptyState}><Ionicons name="leaf-outline" size={28} color="#83919B" /><Text style={styles.emptyTitle}>All clear</Text><Text style={styles.emptyText}>Add a task above when something comes up.</Text></View>}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F7F6" }, container: { flex: 1 }, listContent: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 36 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }, eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.4, color: "#5C6B72" }, greeting: { marginTop: 4, fontSize: 28, fontWeight: "800", color: "#17222B" },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#193E36", justifyContent: "center", alignItems: "center" }, avatarText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
  profileCard: { backgroundColor: "#193E36", borderRadius: 18, padding: 20, marginBottom: 14 }, profileName: { color: "#FFFFFF", fontSize: 20, fontWeight: "800" }, profileDetails: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }, profileDetail: { color: "#C9DDD7", fontSize: 14, fontWeight: "600" }, studentId: { color: "#C9DDD7", fontSize: 12, fontWeight: "700", letterSpacing: 0.3 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 18 }, statCard: { flex: 1, borderRadius: 16, padding: 15, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E1E7E4" }, pendingCard: { borderColor: "#F0E0BE" }, completedCard: { borderColor: "#CDE6D9" }, statIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: "#FFF3D7", alignItems: "center", justifyContent: "center", marginBottom: 10 }, completedIcon: { backgroundColor: "#E3F4EA" }, statNumber: { fontSize: 25, fontWeight: "800", color: "#17222B" }, statLabel: { marginTop: 2, fontSize: 13, color: "#68757F", fontWeight: "600" },
  formCard: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 18, borderWidth: 1, borderColor: "#E1E7E4", marginBottom: 22 }, sectionTitle: { fontSize: 18, fontWeight: "800", color: "#17222B" }, formHint: { marginTop: 4, marginBottom: 14, fontSize: 13, color: "#6B7882" }, input: { height: 48, borderWidth: 1, borderColor: "#D7DFDC", backgroundColor: "#FBFCFC", borderRadius: 10, paddingHorizontal: 13, fontSize: 15, color: "#17222B", marginBottom: 10 }, addButton: { height: 48, borderRadius: 10, backgroundColor: "#E76E4A", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 2 }, addButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" }, pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  feedback: { flexDirection: "row", alignItems: "flex-start", gap: 6, marginTop: 13, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#EDF0EF" }, feedbackText: { flex: 1, color: "#57636E", fontSize: 12.5, lineHeight: 18 }, listHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }, taskCount: { color: "#6B7882", fontSize: 13, fontWeight: "700" },
  taskCard: { minHeight: 76, flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E1E7E4", borderRadius: 14, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 9 }, taskCardCompleted: { backgroundColor: "#F8FCF9", borderColor: "#D9E9DF" }, checkButton: { padding: 3, marginRight: 8 }, taskDetails: { flex: 1, paddingVertical: 2 }, detailsPressed: { opacity: 0.65 }, taskTitle: { color: "#24313A", fontSize: 15, fontWeight: "700", lineHeight: 20 }, taskTitleCompleted: { color: "#7A8A82", textDecorationLine: "line-through" }, dueRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 5 }, dueText: { color: "#697783", fontSize: 12.5, fontWeight: "600" }, deleteButton: { padding: 7, marginLeft: 8 }, iconPressed: { opacity: 0.55, transform: [{ scale: 0.9 }] },
  emptyState: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 14, borderWidth: 1, borderColor: "#E1E7E4", paddingVertical: 28, paddingHorizontal: 20 }, emptyTitle: { marginTop: 6, color: "#24313A", fontSize: 16, fontWeight: "800" }, emptyText: { marginTop: 4, textAlign: "center", color: "#6B7882", fontSize: 13 },
});
