import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return <View style={styles.container}><Text style={styles.title}>Page not found</Text><Link href="/" style={styles.link}>Return home</Link></View>;
}
const styles = StyleSheet.create({ container:{alignItems:"center",flex:1,justifyContent:"center",padding:24},title:{color:"#182235",fontSize:26,fontWeight:"800"},link:{color:"#156F8A",fontSize:16,fontWeight:"700",marginTop:18} });
