import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';


interface Expense {
  id: number;
  amount: number;
  amountType: 'credit' | 'debit';
  desc?: string;
  date?: string;
}

interface Props {
  expenses: Expense[];
}

const ExpensesList: React.FC<Props> = ({ expenses }) => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>All Transactions</ThemedText>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.description}>{item.desc || 'No description'} {' '}<Text style={{ fontSize: 12.5 }}>{item.date}</Text>{'\n'}{item.amountType}</Text>
            <Text style={[styles.amount, item.amountType === 'credit' ? styles.credit : styles.debit]}>
              ₹{item.amount}
            </Text>
          </View>
        )}
      />
    </ThemedView>
  );
};

export default ExpensesList;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  description: {
    fontSize: 16,
  },
  amount: {
    fontSize: 16,
  },
  credit: {
    color: 'green',
  },
  debit: {
    color: 'red',
  },
});
