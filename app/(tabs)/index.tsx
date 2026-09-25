import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { AuthError, getProtectedUser, login, type AuthUser } from "../../services/auth";
import { getRandomQuote } from "../../services/quotes";

const colors = {
  background: "#F5F2EA",
  ink: "#21332D",
  muted: "#748078",
  accent: "#537968",
  card: "#FFFEFA",
  line: "#E9E5DB",
};

export default function QuotesScreen() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [authError, setAuthError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [quoteText, setQuoteText] = useState("");
  const [author, setAuthor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Restore a saved token and check it against the protected profile endpoint.
  useEffect(() => {
    async function restoreSession() {
      try {
        const savedToken = await SecureStore.getItemAsync("quotes-app-access-token");
        if (savedToken) setUser(await getProtectedUser(savedToken));
      } catch (sessionError) {
        if (sessionError instanceof AuthError && [401, 403].includes(sessionError.status)) {
          await SecureStore.deleteItemAsync("quotes-app-access-token");
          setAuthError("Your session expired. Please log in again.");
        } else {
          setAuthError("Couldn’t restore your session. Check your connection and try again.");
        }
      } finally {
        setIsCheckingSession(false);
      }
    }
    void restoreSession();
  }, []);

  const signIn = async () => {
    setIsSigningIn(true);
    setAuthError("");
    try {
      const token = await login(username.trim(), password);
      await SecureStore.setItemAsync("quotes-app-access-token", token);
      let currentUser: AuthUser;
      try {
        currentUser = await getProtectedUser(token);
      } catch (protectedError) {
        await SecureStore.deleteItemAsync("quotes-app-access-token");
        throw protectedError;
      }
      setUser(currentUser);
    } catch (signInError) {
      if (signInError instanceof AuthError && [401, 403].includes(signInError.status)) {
        setAuthError("Login denied (401/403). Check the demo username and password.");
      } else if (signInError instanceof Error && signInError.message) {
        setAuthError(signInError.message);
      } else {
        setAuthError("Couldn’t sign in. Check your connection and try again.");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync("quotes-app-access-token");
    } finally {
      setUser(null);
      setQuoteText("");
      setAuthor("");
    }
  };

  // Keep network and response handling in one place for initial and manual loads.
  const loadQuote = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const quote = await getRandomQuote();
      setQuoteText(quote.text);
      setAuthor(quote.author);
    } catch {
      setError("We couldn’t load a quote right now. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Only load protected-screen content after the user session has been restored.
  useEffect(() => {
    if (user) void loadQuote();
  }, [loadQuote, user]);

  const isEmpty = !quoteText && !error && !isLoading;

  if (isCheckingSession) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.authLoading}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.stateText}>Checking your session…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.loginPage}>
          <View style={styles.heading}>
            <Text style={styles.eyebrow}>QUOTES APP · SECURE LOGIN</Text>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to open your protected quote space.</Text>
          </View>
          <View style={styles.loginCard}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput accessibilityLabel="Username" autoCapitalize="none" autoCorrect={false} onChangeText={setUsername} placeholder="Enter username" placeholderTextColor="#A2AAA1" style={styles.textInput} value={username} />
            <Text style={[styles.inputLabel, styles.passwordLabel]}>Password</Text>
            <TextInput accessibilityLabel="Password" autoCapitalize="none" onChangeText={setPassword} onSubmitEditing={() => void signIn()} placeholder="Enter password" placeholderTextColor="#A2AAA1" secureTextEntry style={styles.textInput} value={password} />
            {authError ? <Text accessibilityRole="alert" style={styles.authError}>{authError}</Text> : null}
            <Pressable accessibilityRole="button" accessibilityState={{ disabled: isSigningIn }} disabled={isSigningIn} onPress={() => void signIn()} style={({ pressed }) => [styles.newQuoteButton, styles.loginButton, (pressed || isSigningIn) && styles.pressed]}>
              {isSigningIn ? <ActivityIndicator color={colors.card} /> : <Text style={styles.newQuoteText}>Log In</Text>}
            </Pressable>
            <Text style={styles.demoHint}>Demo account: emilys · emilyspass</Text>
          </View>
          <Text style={styles.bottomNote}>Your session token is stored securely on this device.</Text>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.page}>
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>A MOMENT FOR YOU</Text>
          <Text style={styles.title}>Words to keep</Text>
          <Text style={styles.subtitle}>Welcome, {user.firstName}. A little perspective, one quote at a time.</Text>
        </View>

        <Pressable accessibilityRole="button" onPress={() => void signOut()} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.quoteMark} accessibilityElementsHidden>“</Text>

          {isLoading ? (
            <View style={styles.stateBox} accessibilityRole="progressbar">
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={styles.stateText}>Finding a thought for today…</Text>
            </View>
          ) : error ? (
            <View style={styles.stateBox}>
              <Text style={styles.stateTitle}>A small pause</Text>
              <Text style={styles.stateText}>{error}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => void loadQuote()}
                style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
              >
                <Text style={styles.retryText}>Try Again</Text>
              </Pressable>
            </View>
          ) : isEmpty ? (
            <View style={styles.stateBox}>
              <Text style={styles.stateTitle}>Nothing here just yet</Text>
              <Text style={styles.stateText}>Let’s look for a quote to brighten the moment.</Text>
            </View>
          ) : (
            <View style={styles.quoteContent}>
              <Text style={styles.quoteText}>“{quoteText}”</Text>
              <View style={styles.authorRow}>
                <View style={styles.authorRule} />
                <Text style={styles.author}>{author}</Text>
              </View>
            </View>
          )}

          <View style={styles.cardFooter}>
            <Text style={styles.footerText}>DAILY INSPIRATION</Text>
            <View style={styles.footerDot} />
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isLoading }}
          disabled={isLoading}
          onPress={() => void loadQuote()}
          style={({ pressed }) => [styles.newQuoteButton, (pressed || isLoading) && styles.pressed]}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.card} size="small" />
          ) : (
            <Text style={styles.newQuoteText}>New Quote</Text>
          )}
        </Pressable>
        <Text style={styles.bottomNote}>Take what you need. Carry it with you.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  authLoading: { alignItems: "center", flex: 1, justifyContent: "center" },
  loginPage: { flex: 1, justifyContent: "center", paddingHorizontal: 26, paddingVertical: 24 },
  loginCard: { backgroundColor: colors.card, borderColor: colors.line, borderRadius: 22, borderWidth: 1, padding: 24 },
  inputLabel: { color: colors.ink, fontSize: 13, fontWeight: "700", marginBottom: 8 },
  passwordLabel: { marginTop: 18 },
  textInput: { backgroundColor: "#FAF9F5", borderColor: colors.line, borderRadius: 12, borderWidth: 1, color: colors.ink, fontSize: 16, minHeight: 50, paddingHorizontal: 14 },
  authError: { color: "#A43D38", fontSize: 13, lineHeight: 19, marginTop: 16 },
  loginButton: { marginTop: 22 },
  demoHint: { color: colors.muted, fontSize: 12, marginTop: 16, textAlign: "center" },
  logoutButton: { alignSelf: "flex-end", borderColor: "#C9D4CA", borderRadius: 10, borderWidth: 1, marginBottom: 14, marginTop: -14, paddingHorizontal: 14, paddingVertical: 8 },
  logoutText: { color: colors.accent, fontSize: 12, fontWeight: "700" },
  page: { flex: 1, justifyContent: "center", paddingHorizontal: 26, paddingVertical: 24 },
  heading: { marginBottom: 28 },
  eyebrow: { color: colors.accent, fontSize: 11, fontWeight: "800", letterSpacing: 2.1 },
  title: { color: colors.ink, fontSize: 34, fontWeight: "700", letterSpacing: -0.8, marginTop: 10 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 8 },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 24,
    borderWidth: 1,
    elevation: 3,
    minHeight: 310,
    padding: 26,
    shadowColor: "#273C31",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
  },
  quoteMark: { color: "#B7C8BC", fontFamily: "Georgia", fontSize: 72, height: 64, lineHeight: 80 },
  quoteContent: { flex: 1, justifyContent: "center", paddingBottom: 20, paddingTop: 12 },
  quoteText: { color: colors.ink, fontFamily: "Georgia", fontSize: 25, lineHeight: 36 },
  authorRow: { alignItems: "center", flexDirection: "row", marginTop: 24 },
  authorRule: { backgroundColor: "#9BAFA1", height: 1, marginRight: 12, width: 24 },
  author: { color: colors.accent, fontSize: 14, fontWeight: "700", letterSpacing: 0.3 },
  stateBox: { alignItems: "center", flex: 1, justifyContent: "center", minHeight: 160, paddingHorizontal: 8 },
  stateTitle: { color: colors.ink, fontSize: 20, fontWeight: "700", textAlign: "center" },
  stateText: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 14, textAlign: "center" },
  retryButton: { borderColor: colors.accent, borderRadius: 12, borderWidth: 1, marginTop: 18, paddingHorizontal: 20, paddingVertical: 11 },
  retryText: { color: colors.accent, fontSize: 14, fontWeight: "700" },
  cardFooter: { alignItems: "center", borderTopColor: colors.line, borderTopWidth: 1, flexDirection: "row", justifyContent: "space-between", paddingTop: 18 },
  footerText: { color: "#A2AAA1", fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  footerDot: { backgroundColor: "#B7C8BC", borderRadius: 3, height: 6, width: 6 },
  newQuoteButton: { alignItems: "center", backgroundColor: colors.accent, borderRadius: 15, elevation: 2, justifyContent: "center", marginTop: 22, minHeight: 56, shadowColor: colors.accent, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 8 },
  newQuoteText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },
  pressed: { opacity: 0.72 },
  bottomNote: { color: colors.muted, fontSize: 12, letterSpacing: 0.2, marginTop: 20, textAlign: "center" },
});
