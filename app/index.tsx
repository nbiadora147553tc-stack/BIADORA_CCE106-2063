import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CalculatorScreen() {
  // Store the two input values
  const [firstNumber, setFirstNumber] = useState('');
  const [secondNumber, setSecondNumber] = useState('');

  // Store the calculation result or error message
  const [result, setResult] = useState('');

  // Addition
  const addNumbers = () => {
    if (firstNumber.trim() === '' || secondNumber.trim() === '') {
      setResult('Please enter both numbers.');
      return;
    }

    const num1 = Number(firstNumber);
    const num2 = Number(secondNumber);

    if (isNaN(num1) || isNaN(num2)) {
      setResult('Please enter valid numbers.');
      return;
    }

    setResult(`Result: ${num1 + num2}`);
  };

  // Subtraction
  const subtractNumbers = () => {
    if (firstNumber.trim() === '' || secondNumber.trim() === '') {
      setResult('Please enter both numbers.');
      return;
    }

    const num1 = Number(firstNumber);
    const num2 = Number(secondNumber);

    if (isNaN(num1) || isNaN(num2)) {
      setResult('Please enter valid numbers.');
      return;
    }

    setResult(`Result: ${num1 - num2}`);
  };

  // Multiplication
  const multiplyNumbers = () => {
    if (firstNumber.trim() === '' || secondNumber.trim() === '') {
      setResult('Please enter both numbers.');
      return;
    }

    const num1 = Number(firstNumber);
    const num2 = Number(secondNumber);

    if (isNaN(num1) || isNaN(num2)) {
      setResult('Please enter valid numbers.');
      return;
    }

    setResult(`Result: ${num1 * num2}`);
  };

  // Division
  const divideNumbers = () => {
    if (firstNumber.trim() === '' || secondNumber.trim() === '') {
      setResult('Please enter both numbers.');
      return;
    }

    const num1 = Number(firstNumber);
    const num2 = Number(secondNumber);

    if (isNaN(num1) || isNaN(num2)) {
      setResult('Please enter valid numbers.');
      return;
    }

    // Prevent division by zero
    if (num2 === 0) {
      setResult('Cannot divide by zero.');
      return;
    }

    setResult(`Result: ${num1 / num2}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple Calculator</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter first number"
        keyboardType="numeric"
        value={firstNumber}
        onChangeText={setFirstNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter second number"
        keyboardType="numeric"
        value={secondNumber}
        onChangeText={setSecondNumber}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={addNumbers}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={subtractNumbers}>
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={multiplyNumbers}>
          <Text style={styles.buttonText}>×</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={divideNumbers}>
          <Text style={styles.buttonText}>÷</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.result}>{result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#222',
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    marginBottom: 15,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  button: {
    backgroundColor: '#007AFF',
    width: 65,
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },

  result: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
});
