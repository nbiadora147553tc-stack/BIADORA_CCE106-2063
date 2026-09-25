import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { AuthError, getProtectedUser, login, type AuthUser } from "../../services/auth";

const TOKEN_KEY = "authenticated-student-portal-token";
const colors = { background: "#F3F6FB", ink: "#17243A", muted: "#718097", blue: "#315FEA", card: "#FFFFFF", line: "#E3E9F2", red: "#B42318" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function StudentPortalScreen() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [email, setEmail] = useState("emily.johnson@x.dummyjson.com");
  const [password, setPassword] = useState("emilyspass");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [authMessage, setAuthMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // Restore and validate the saved session before showing login or protected content.
  useEffect(() => {
    let active = true;
    async function restoreSession() {
      try {
        const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (savedToken) {
          const restoredUser = await getProtectedUser(savedToken);
          if (active) { setToken(savedToken); setUser(restoredUser); }
        }
      } catch (error) {
        if (error instanceof AuthError && [401, 403].includes(error.status)) {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          if (active) setAuthMessage("Session expired, please log in again.");
        } else if (active) {
          setAuthMessage("Couldn't restore your session. Check your connection and try again.");
        }
      } finally {
        if (active) setIsAuthLoading(false);
      }
    }
    void restoreSession();
    return () => { active = false; };
  }, []);

  async function signIn() {
    const nextErrors: { email?: string; password?: string } = {};
    if (!email.trim()) nextErrors.email = "Email is required.";
    else if (!emailPattern.test(email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    setAuthMessage("");
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      const accessToken = await login(email.trim(), password);
      await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
      setToken(accessToken);
      setIsProfileLoading(true);
      try {
        setUser(await getProtectedUser(accessToken));
      } catch (error) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setToken(null);
        if (error instanceof AuthError && [401, 403].includes(error.status)) {
          setAuthMessage("Session expired, please log in again.");
        } else {
          setAuthMessage(error instanceof Error ? error.message : "Couldn't load your profile. Try again.");
        }
      } finally {
        setIsProfileLoading(false);
      }
    } catch (error) {
      setAuthMessage(error instanceof AuthError ? error.message : "Couldn't sign in. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Clear both secure storage and in-memory session on logout.
  async function signOut() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch {
      setAuthMessage("Couldn't clear the saved session. Please try logging out again.");
      return;
    }
    setToken(null);
    setUser(null);
    setAuthMessage("");
    setPassword("");
  }

  if (isAuthLoading || isProfileLoading) {
    return <SafeAreaView style={styles.safeArea}><View style={styles.center}><ActivityIndicator size="large" color={colors.blue} /><Text style={styles.mutedText}>Checking your secure session…</Text></View></SafeAreaView>;
  }

  if (user && token) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.page}>
          <View style={styles.topRow}><View><Text style={styles.eyebrow}>STUDENT PORTAL</Text><Text style={styles.title}>My profile</Text></View><Pressable accessibilityRole="button" onPress={() => void signOut()} style={styles.logout}><Text style={styles.logoutText}>Log out</Text></Pressable></View>
          <View style={styles.hero}><View style={styles.avatar}><Text style={styles.avatarText}>{user.firstName?.[0] ?? "S"}{user.lastName?.[0] ?? ""}</Text></View><Text style={styles.name}>{user.firstName} {user.lastName}</Text><Text style={styles.subtitle}>Authenticated student</Text><View style={styles.status}><View style={styles.statusDot} /><Text style={styles.statusText}>Secure session active</Text></View></View>
          <Text style={styles.sectionLabel}>ACCOUNT DETAILS</Text>
          <View style={styles.detailsCard}><Detail label="Email address" value={user.email} /><Detail label="Student ID" value={String(user.id)} /><Detail label="Username" value={user.username} />{user.role ? <Detail label="Role" value={user.role} last /> : null}</View>
          <Text style={styles.note}>Your session is restored automatically when you reopen the app.</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
        <ScrollView contentContainerStyle={styles.loginPage} keyboardShouldPersistTaps="handled">
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>S</Text></View>
          <Text style={styles.eyebrow}>AUTHENTICATED STUDENT PORTAL</Text>
          <Text style={styles.loginTitle}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in with your student account to continue.</Text>
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput accessibilityLabel="Email" autoCapitalize="none" autoComplete="email" autoCorrect={false} keyboardType="email-address" onChangeText={(value) => { setEmail(value); setErrors((current) => ({ ...current, email: undefined })); }} placeholder="you@example.com" placeholderTextColor="#9AA6B7" style={[styles.input, errors.email ? styles.inputError : null]} value={email} />
            {errors.email ? <Text accessibilityRole="alert" style={styles.errorText}>{errors.email}</Text> : null}
            <Text style={[styles.label, styles.passwordLabel]}>Password</Text>
            <TextInput accessibilityLabel="Password" autoCapitalize="none" autoComplete="password" onChangeText={(value) => { setPassword(value); setErrors((current) => ({ ...current, password: undefined })); }} onSubmitEditing={() => void signIn()} placeholder="Enter your password" placeholderTextColor="#9AA6B7" secureTextEntry style={[styles.input, errors.password ? styles.inputError : null]} value={password} />
            {errors.password ? <Text accessibilityRole="alert" style={styles.errorText}>{errors.password}</Text> : null}
            {authMessage ? <Text accessibilityRole="alert" style={styles.authError}>{authMessage}</Text> : null}
            <Pressable accessibilityRole="button" accessibilityState={{ disabled: isSubmitting }} disabled={isSubmitting} onPress={() => void signIn()} style={({ pressed }) => [styles.loginButton, (pressed || isSubmitting) && styles.pressed]}>
              {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginButtonText}>Log in</Text>}
            </Pressable>
          </View>
          <View style={styles.demoBox}><Text style={styles.demoTitle}>Demo account</Text><Text style={styles.demoText}>emily.johnson@x.dummyjson.com</Text><Text style={styles.demoText}>Password: emilyspass</Text></View>
          <Text style={styles.footer}>Protected with secure on-device session storage</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Detail({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return <View style={[styles.detailRow, last && styles.lastDetailRow]}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background }, keyboard: { flex: 1 },
  center: { alignItems: "center", flex: 1, justifyContent: "center", padding: 24 },
  page: { flexGrow: 1, justifyContent: "center", padding: 24 },
  loginPage: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 26, paddingVertical: 32 },
  brandMark: { alignItems: "center", alignSelf: "center", backgroundColor: colors.blue, borderRadius: 18, height: 58, justifyContent: "center", marginBottom: 24, width: 58 },
  brandMarkText: { color: "#FFFFFF", fontSize: 28, fontWeight: "800" },
  eyebrow: { color: colors.blue, fontSize: 11, fontWeight: "800", letterSpacing: 1.6 },
  loginTitle: { color: colors.ink, fontSize: 34, fontWeight: "800", letterSpacing: -0.7, marginTop: 12 },
  title: { color: colors.ink, fontSize: 31, fontWeight: "800", letterSpacing: -0.5, marginTop: 8 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 23, marginTop: 8 },
  form: { backgroundColor: colors.card, borderColor: colors.line, borderRadius: 20, borderWidth: 1, marginTop: 28, padding: 20 },
  label: { color: colors.ink, fontSize: 13, fontWeight: "700", marginBottom: 8 },
  passwordLabel: { marginTop: 18 },
  input: { backgroundColor: "#FCFDFE", borderColor: colors.line, borderRadius: 12, borderWidth: 1, color: colors.ink, fontSize: 15, minHeight: 52, paddingHorizontal: 14 },
  inputError: { borderColor: colors.red }, errorText: { color: colors.red, fontSize: 12, marginTop: 6 }, authError: { color: colors.red, fontSize: 13, lineHeight: 19, marginTop: 14 },
  loginButton: { alignItems: "center", backgroundColor: colors.blue, borderRadius: 13, justifyContent: "center", marginTop: 22, minHeight: 52 },
  loginButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" }, pressed: { opacity: 0.72 },
  demoBox: { backgroundColor: "#EAF0FF", borderRadius: 13, marginTop: 18, padding: 14 }, demoTitle: { color: colors.ink, fontSize: 12, fontWeight: "800", marginBottom: 5 }, demoText: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  footer: { color: colors.muted, fontSize: 11, marginTop: 24, textAlign: "center" }, mutedText: { color: colors.muted, fontSize: 14, marginTop: 14 },
  topRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 24 }, logout: { borderColor: "#D3DCEB", borderRadius: 11, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 9 }, logoutText: { color: colors.blue, fontSize: 13, fontWeight: "700" },
  hero: { alignItems: "center", backgroundColor: colors.card, borderColor: colors.line, borderRadius: 22, borderWidth: 1, paddingHorizontal: 20, paddingVertical: 28 }, avatar: { alignItems: "center", backgroundColor: "#EAF0FF", borderRadius: 34, height: 68, justifyContent: "center", width: 68 }, avatarText: { color: colors.blue, fontSize: 22, fontWeight: "800" }, name: { color: colors.ink, fontSize: 24, fontWeight: "800", marginTop: 16 }, status: { alignItems: "center", backgroundColor: "#EAF7F0", borderRadius: 20, flexDirection: "row", marginTop: 18, paddingHorizontal: 12, paddingVertical: 8 }, statusDot: { backgroundColor: "#29935F", borderRadius: 4, height: 8, marginRight: 7, width: 8 }, statusText: { color: "#28744F", fontSize: 12, fontWeight: "700" },
  sectionLabel: { color: colors.muted, fontSize: 11, fontWeight: "800", letterSpacing: 1.1, marginBottom: 10, marginTop: 26 }, detailsCard: { backgroundColor: colors.card, borderColor: colors.line, borderRadius: 18, borderWidth: 1, paddingHorizontal: 18 }, detailRow: { borderBottomColor: colors.line, borderBottomWidth: 1, paddingVertical: 15 }, lastDetailRow: { borderBottomWidth: 0 }, detailLabel: { color: colors.muted, fontSize: 12, marginBottom: 5 }, detailValue: { color: colors.ink, fontSize: 15, fontWeight: "600" }, note: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 20, textAlign: "center" },
});
