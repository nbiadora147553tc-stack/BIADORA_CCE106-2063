# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CounterProps {
  /** Configurable increment/decrement value (default: 1) */
  step?: number;
  /** Optional starting value (default: 0) */
  initialValue?: number;
}

export default function CounterApp({ step = 1, initialValue = 0 }: CounterProps) {
  const [count, setCount] = useState<number>(initialValue);

  // Event handler for incrementing
  const handleIncrement = () => {
    setCount((prev) => prev + step);
  };

  // Event handler for decrementing (prevents going below zero)
  const handleDecrement = () => {
    setCount((prev) => Math.max(0, prev - step));
  };

  // Event handler for resetting the counter
  const handleReset = () => {
    setCount(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter App</Text>

      {/* Displays current counter value */}
      <Text style={styles.counterValue}>{count}</Text>

      {/* Control Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={[styles.button, styles.decrementBtn]} 
          onPress={handleDecrement}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>-{step}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.resetBtn]} 
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.incrementBtn]} 
          onPress={handleIncrement}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>+{step}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
  },
  counterValue: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#0D6EFD',
    marginVertical: 24,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 75,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  decrementBtn: {
    backgroundColor: '#DC3545',
  },
  resetBtn: {
    backgroundColor: '#6C757D',
  },
  incrementBtn: {
    backgroundColor: '#198754',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
<<<<<<< HEAD
"# BIADORA_CCE106-2063" 
=======
"# BIADORA_CCE106-2063" 
>>>>>>> 0f3923e5a33650827b163092c4db69bcbc43293e
