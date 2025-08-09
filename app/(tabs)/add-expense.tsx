import { useState } from 'react';
import { Alert, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { saveTransaction, Transaction } from '../utils/storage';

export default function AddExpense() {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [method, setMethod] = useState<string>('cash');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onSave = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0 || !category.trim()) {
      Alert.alert('Invalid input', 'Enter a valid amount and category.');
      return;
    }
    const tx: Transaction = {
      id: Date.now().toString(),
      type,
      amount: value,
      category: category.trim(),
      description: description.trim() || undefined,
      method,
      date: date.toISOString(),
    };
    await saveTransaction(tx);
    Alert.alert('Saved', 'Transaction added.');
    setAmount('');
    setCategory('');
    setDescription('');
    setMethod('cash');
    setType('expense');
    setDate(new Date());
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Add Transaction</Text>

      <Text style={{ fontSize: 12, color: '#6B7280' }}>Type</Text>
      <View style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, marginBottom: 12 }}>
        <Picker selectedValue={type} onValueChange={(v) => setType(v)}>
          <Picker.Item label="Expense" value="expense" />
          <Picker.Item label="Income" value="income" />
        </Picker>
      </View>

      <Text style={{ marginBottom: 4 }}>Amount</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        placeholder="0.00"
        style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 12 }}
      />

      <Text style={{ marginBottom: 4 }}>Category</Text>
      <TextInput
        value={category}
        onChangeText={setCategory}
        placeholder="e.g., Groceries"
        style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 12 }}
      />

      <Text style={{ marginBottom: 4 }}>Description (optional)</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Notes"
        style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 12 }}
      />

      <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Payment Method</Text>
      <View style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, marginBottom: 12 }}>
        <Picker selectedValue={method} onValueChange={(v) => setMethod(v)}>
          <Picker.Item label="Cash" value="cash" />
          <Picker.Item label="Card" value="card" />
          <Picker.Item label="Transfer" value="transfer" />
        </Picker>
      </View>

      <Text style={{ marginBottom: 4 }}>Date</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, d) => {
            setShowDatePicker(false);
            if (d) setDate(d);
          }}
        />
      )}

      <TouchableOpacity onPress={onSave} style={{ backgroundColor: '#10B981', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
