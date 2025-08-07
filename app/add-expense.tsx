import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { saveTransaction } from './utils/storage';

export default function AddExpense() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };
   const handleAdd = () => {
  console.log('🟢 Button pressed');

  if (!amount || !category || !description || !paymentMethod) {
    console.log('🟡 Missing field');
    alert('Please fill all fields');
    return;
  }

  const newTransaction = {
    id: Date.now(),
    amount,
    category,
    description,
    date: date.toDateString(),
    paymentMethod,
  };

  console.log('🟢 Saving transaction:', newTransaction);

  saveTransaction(newTransaction);
  setAmount('');
  setCategory('');
  setDescription('');
  setPaymentMethod('');
  setDate(new Date());

  alert('Transaction saved!');
};


  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Record New Expense</Text>

      {/* Amount */}
      <Text style={{ marginBottom: 6 }}>Amount</Text>
      <TextInput
        placeholder="0.00"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />

      {/* Category */}
      <Text style={{ marginBottom: 6 }}>Category</Text>
      <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 16 }}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="Select a category" value="" />
          <Picker.Item label="🍕 Food & Dining" value="food" />
          <Picker.Item label="🚗 Transportation" value="transportation" />
          <Picker.Item label="🎬 Entertainment" value="entertainment" />
          <Picker.Item label="🛍️ Shopping" value="shopping" />
          <Picker.Item label="💡 Utilities" value="utilities" />
          <Picker.Item label="🏥 Healthcare" value="healthcare" />
          <Picker.Item label="📚 Education" value="education" />
          <Picker.Item label="📦 Other" value="other" />
        </Picker>
      </View>

      {/* Description */}
      <Text style={{ marginBottom: 6 }}>Description</Text>
      <TextInput
        placeholder="What did you spend on?"
        value={description}
        onChangeText={setDescription}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />

      {/* Date */}
      <Text style={{ marginBottom: 6 }}>Date</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      >
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Payment Method */}
      <Text style={{ marginBottom: 6 }}>Payment Method</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
        {['cash', 'card'].map((method) => (
          <TouchableOpacity
            key={method}
            onPress={() => setPaymentMethod(method)}
            style={{
              flex: 1,
              padding: 12,
              borderWidth: 1,
              borderColor: paymentMethod === method ? '#10B981' : '#ccc',
              backgroundColor: paymentMethod === method ? '#D1FAE5' : '#fff',
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text>{method === 'cash' ? '💵 Cash' : '💳 Card'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Buttons */}
      <TouchableOpacity
      onPress={handleAdd}
        style={{
          backgroundColor: '#10B981',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add Expense</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: '#E5E7EB',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#374151', fontWeight: 'bold' }}>Cancel</Text>
      </TouchableOpacity>

      {/* Quick Add */}
      <Text style={{ marginTop: 24, marginBottom: 12, fontSize: 18, fontWeight: 'bold' }}>
        Quick Add
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {[
          { emoji: '☕', label: 'Coffee', value: '$5.00' },
          { emoji: '🍔', label: 'Lunch', value: '$12.00' },
          { emoji: '⛽', label: 'Gas', value: '$40.00' },
          { emoji: '🎬', label: 'Movie', value: '$15.00' },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              padding: 12,
              width: '47%',
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
            <Text style={{ fontWeight: '600' }}>{item.label}</Text>
            <Text style={{ color: '#6B7280', fontSize: 12 }}>{item.value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
