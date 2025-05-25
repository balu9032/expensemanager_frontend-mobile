import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Pressable, Platform } from 'react-native';
import axios from 'axios';
import { useTheme } from '@react-navigation/native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import DateTimePicker from '@react-native-community/datetimepicker';



const AddExpense = () => {
  const { colors, dark } = useTheme();
  const [amount, setAmount] = useState('');
  const [amountType, setAmountType] = useState<'credit' | 'debit'>('credit');
  const [desc, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleSubmit = async () => {
    if (!amount) {
      Alert.alert('Please enter an amount');
      return;
    }

    try {
      await axios.post('https://expensemanager_backend.up.railway.app/api/expenses', {
        amount: Number(amount),
        amountType,
        desc: String(desc),
        date: date.toISOString().split('T')[0],
      });

      Alert.alert('Expense added successfully!');
      setAmount('');
      setAmountType('credit');
      setDescription('');
      setDate(new Date());
    } catch (error) {
      console.error('Error adding expense:', error);
      Alert.alert('Failed to add expense');
    }
  };

  const onChangeDate = (_event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  };


  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedText style={[styles.heading, { backgroundColor: colors.background }]}>Expense Description</ThemedText>

      <TextInput
        style={[styles.input, { backgroundColor: colors.background, color: colors.text, }]}
        placeholder="Description"
        placeholderTextColor='#888'
        keyboardType="ascii-capable"
        value={desc}
        onChangeText={setDescription}
      />

      <ThemedText style={[styles.heading, { backgroundColor: colors.background }]}>Expense Amount</ThemedText>

      <TextInput
        style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
        placeholder="Amount"
        placeholderTextColor='#888'
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />


      <ThemedView style={styles.radioGroup}>
        <ThemedText
          style={[
            styles.radio,
            amountType === 'credit' && styles.radioSelected, { color: colors.text }
          ]}
          onPress={() => setAmountType('credit')}
        >
          Credit
        </ThemedText>
        <ThemedText
          style={[
            styles.radio,
            amountType === 'debit' && styles.radioSelected, { color: colors.text }
          ]}
          onPress={() => setAmountType('debit')}
        >
          Debit
        </ThemedText>
      </ThemedView>
      <Pressable onPress={() => setShowPicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>Date: {date.toDateString()}</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
      <Button title="Add Expense" onPress={handleSubmit} />
    </ThemedView>
  );
};

export default AddExpense;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#000',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    backgroundColor: '#000',
  },
  input: {
    borderColor: '#aaa',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  radio: {
    marginRight: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    color: '#000',
  },
  radioSelected: {
    backgroundColor: '#007bff',
    color: '#fff',
    borderColor: '#007bff',
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginVertical: 10,
  },
  dateText: {
    color: '#000',
  },
});
