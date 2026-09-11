import { Link } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  return <SafeAreaView style={styles.safeArea}><View style={styles.container}>
    <Text style={styles.eyebrow}>PROFILE</Text><Text style={styles.title}>Student profile</Text>
    <View style={styles.panel}><Text style={styles.name}>Alex Rivera</Text><Text style={styles.detail}>Bachelor of Information Technology</Text><Text style={styles.detail}>Current course: CCE 106</Text></View>
    <Link href="/settings" style={styles.link}>Manage settings</Link>
  </View></SafeAreaView>;
}
const styles = StyleSheet.create({ safeArea:{flex:1,backgroundColor:"#F8FCFD"},container:{padding:24,paddingTop:36},eyebrow:{color:"#156F8A",fontSize:11,fontWeight:"800",letterSpacing:.8},title:{color:"#182235",fontSize:30,fontWeight:"800",marginTop:16},panel:{backgroundColor:"#FFF",borderRadius:14,marginTop:26,padding:20},name:{color:"#182235",fontSize:21,fontWeight:"800"},detail:{color:"#637080",fontSize:15,marginTop:10},link:{color:"#156F8A",fontSize:16,fontWeight:"700",marginTop:24} });
