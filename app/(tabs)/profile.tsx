import { Redirect } from "expo-router";

// The root screen owns the session check and protected profile UI.
export default function ProfileRoute() {
  return <Redirect href="/" />;
}
