import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  return <SafeAreaView style={styles.safeArea}><View style={styles.container}>
    <Text style={styles.eyebrow}>SETTINGS</Text><Text style={styles.title}>App preferences</Text>
    <View style={styles.panel}><Text style={styles.item}>Notifications</Text><Text style={styles.item}>Appearance</Text><Text style={styles.item}>Accessibility</Text></View>
    <Pressable onPress={() => router.replace("/")} style={styles.button}><Text style={styles.buttonText}>Return home with replace</Text></Pressable>
  </View></SafeAreaView>;
}
const styles = StyleSheet.create({ safeArea:{flex:1,backgroundColor:"#F8FCFD"},container:{padding:24,paddingTop:36},eyebrow:{color:"#156F8A",fontSize:11,fontWeight:"800",letterSpacing:.8},title:{color:"#182235",fontSize:30,fontWeight:"800",marginTop:16},panel:{backgroundColor:"#FFF",borderRadius:14,marginTop:26,paddingHorizontal:20},item:{borderBottomColor:"#E3EAEC",borderBottomWidth:1,color:"#293544",fontSize:16,paddingVertical:18},button:{backgroundColor:"#156F8A",borderRadius:12,marginTop:28,padding:16},buttonText:{color:"#FFF",fontSize:16,fontWeight:"700",textAlign:"center"} });
