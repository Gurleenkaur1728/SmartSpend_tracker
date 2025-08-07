import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { getTransactions } from './utils/storage';

export default function HomeScreen() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const monthlyBudget = 2000;
const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getTransactions();
      setTransactions(data || []);
       const storedUser = await AsyncStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    };
    load();
  }, []);
  


  // Total spent
  const totalSpent = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const remaining = monthlyBudget - totalSpent;
  const percentageUsed = (totalSpent / monthlyBudget) * 100;

  // Spending by category
  const categoryTotals: Record<string, number> = {};
  transactions.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + parseFloat(t.amount);
  });

  // Recent transactions (latest 3)
  const recent = [...transactions].reverse().slice(0, 3);

  return (
    <ScrollView style={{ padding: 16 }}>
      {/* Welcome Section */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>
         Welcome back, {user?.name || 'User'}!
      </Text>
      <Text style={{ color: '#6B7280', marginBottom: 16 }}>
        Here’s a summary of your spending this month
      </Text>

      {/* Budget Overview */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          padding: 16,
          marginBottom: 20,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>Monthly Budget</Text>
          <Text style={{ color: '#6B7280', fontSize: 12 }}>August 2025</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ color: '#6B7280', fontSize: 12 }}>Spent</Text>
          <Text style={{ fontWeight: 'bold' }}>
            ${totalSpent.toFixed(0)} / ${monthlyBudget}
          </Text>
        </View>
        <View
          style={{
            height: 10,
            backgroundColor: '#E5E7EB',
            borderRadius: 10,
            overflow: 'hidden',
            marginBottom: 6,
          }}
        >
          <View
            style={{
              width: `${percentageUsed}%`,
              backgroundColor: '#10B981',
              height: '100%',
            }}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: '#10B981', fontWeight: '500' }}>${remaining.toFixed(0)} remaining</Text>
          <Text style={{ color: '#6B7280', fontSize: 12 }}>{percentageUsed.toFixed(0)}% used</Text>
        </View>
      </View>

      {/* Spending by Category */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          padding: 16,
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
          Spending by Category
        </Text>

        {Object.keys(categoryTotals).map((cat) => (
          <View
            key={cat}
            style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}
          >
            <Text>{cat}</Text>
            <Text style={{ fontWeight: '500' }}>${categoryTotals[cat].toFixed(0)}</Text>
          </View>
        ))}
      </View>

      {/* Recent Transactions */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          padding: 16,
          marginBottom: 20,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={{ color: '#10B981', fontSize: 12, fontWeight: 'bold' }}>View All</Text>
          </TouchableOpacity>
        </View>

        {recent.length === 0 ? (
          <Text style={{ color: '#9CA3AF' }}>No recent transactions yet.</Text>
        ) : (
          recent.map((item, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#F3F4F6',
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <Text>💸</Text>
                </View>
                <View>
                  <Text style={{ fontWeight: 'bold' }}>{item.description}</Text>
                  <Text style={{ color: '#6B7280', fontSize: 12 }}>
                    {item.category} • {item.paymentMethod}
                  </Text>
                </View>
              </View>
              <Text style={{ color: '#DC2626', fontWeight: '600' }}>-${item.amount}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
