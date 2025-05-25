import { View, Text, Button, StyleSheet, Pressable, ScrollView, } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from 'react-native';
import ExpensePieChart from '../ExpensePieChart';
import ExpensesList from '../ExpensesList';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';


interface Expense {
  id: number;
  amount: number;
  amountType: 'credit' | 'debit';
  desc?: string;
  date?: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors, dark } = useTheme();
  const [showChartModal, setShowChartModal] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);

  useFocusEffect(
    useCallback(() => {
      axios.get<Expense[]>('https://expensemanager_backend.up.railway.app/api/expenses')
        .then(res => {
          setExpenses(res.data);
          calculateTotals(res.data);
        })
        .catch(err => console.error('Error fetching expenses:', err));
    }, []));

  useEffect(() => {
    console.log('Fetched expenses:', expenses);
  }, [expenses]);

  const calculateTotals = (data: Expense[]) => {
    const credit = data
      .filter(e => e.amountType === 'credit')
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const debit = data
      .filter(e => e.amountType === 'debit')
      .reduce((sum, e) => sum + Number(e.amount), 0);

    setTotalCredit(credit);
    setTotalDebit(debit);
  };


  return (
    <ScrollView>
      <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemedView style={[styles.row, { backgroundColor: colors.background }]}>
          <ThemedText style={[styles.title, { color: colors.text }]}>Expense Manager</ThemedText>
          <Pressable style={styles.button} onPress={() => router.push('./AddExpense')}>
            <ThemedText style={styles.buttonText}>+Add Expense</ThemedText>
          </Pressable></ThemedView>
        <ThemedView style={styles.total}>
          <ThemedText style={[styles.label, { color: colors.text }]}>Total Credit:</ThemedText>
          <ThemedText style={styles.credit}>₹{totalCredit}</ThemedText>
          <ThemedText style={[styles.label, { color: colors.text }]}>Total Debit:</ThemedText>
          <ThemedText style={styles.debit}>₹{totalDebit}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.row}>
          <ThemedText style={[styles.label, { color: colors.text }]}>Balance:</ThemedText>
          <ThemedText style={[styles.credit, { color: totalCredit - totalDebit > 0 ? 'green' : 'red' }]}> ₹{totalCredit - totalDebit}</ThemedText>
          <Pressable style={styles.button} onPress={() =>  setShowChartModal(true)}>
            <ThemedText style={styles.buttonText}>Show Chart</ThemedText>
          </Pressable>
        </ThemedView>
        <ExpensesList expenses={expenses} />
        <Modal
  visible={showChartModal}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setShowChartModal(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <ExpensePieChart totalCredit={totalCredit} totalDebit={totalDebit} />
      <Pressable onPress={() => setShowChartModal(false)} style={styles.button}>
        <Text style={styles.buttonText}>Close</Text>
      </Pressable>
    </View>
  </View>
</Modal>
      </ThemedView>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 5,
    paddingBottom: 12,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 18,
    color: '#fff',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#0A84FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
  total: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 18,
  },
  credit: {
    fontSize: 18,
    color: 'green',
  },
  debit: {
    fontSize: 18,
    color: 'red',
  },
  modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
},
modalContent: {
  width: '90%',
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 20,
  alignItems: 'center',
},

});
