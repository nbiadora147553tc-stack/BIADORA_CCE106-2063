import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

const courses: Record<string, { code: string; title: string; description: string }> = {
  cce106: { code: "CCE 106", title: "Mobile Application Development", description: "Learn the foundations of building useful cross-platform mobile experiences." },
  cce206: { code: "CCE 206", title: "Navigation and Interfaces", description: "Practice layouts, parameters, navigation history, and screen relationships." },
};

export default function CourseScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const router = useRouter();
  const course = typeof courseId === "string" ? courses[courseId.toLowerCase()] : undefined;

  return <SafeAreaView style={styles.safeArea}><View style={styles.container}>
    {course ? <><Text style={styles.eyebrow}>{course.code}</Text><Text style={styles.title}>{course.title}</Text><Text style={styles.copy}>{course.description}</Text></> : <><Text style={styles.eyebrow}>INVALID PARAMETER</Text><Text style={styles.title}>Course not found</Text><Text style={styles.copy}>“{String(courseId)}” is not an available course. Choose a valid course to continue.</Text></>}
    <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace("/")} style={styles.button}><Text style={styles.buttonText}>Go back</Text></Pressable>
    <Link href="/" style={styles.homeLink}>Back to Home</Link>
  </View></SafeAreaView>;
}
const styles = StyleSheet.create({ safeArea:{flex:1,backgroundColor:"#F8FCFD"},container:{flex:1,justifyContent:"center",padding:24},eyebrow:{color:"#156F8A",fontSize:12,fontWeight:"800",letterSpacing:1},title:{color:"#182235",fontSize:31,fontWeight:"800",lineHeight:38,marginTop:16},copy:{color:"#637080",fontSize:16,lineHeight:24,marginTop:14},button:{backgroundColor:"#156F8A",borderRadius:12,marginTop:32,padding:16},buttonText:{color:"#FFF",fontSize:16,fontWeight:"700",textAlign:"center"},homeLink:{color:"#156F8A",fontSize:16,fontWeight:"700",marginTop:20,textAlign:"center"} });
