import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { getTransactions } from './utils/storage';

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const loadTransactions = async () => {
      const data = await getTransactions();
      setTransactions(data);
    };
    loadTransactions();
  }, []);

  const groupByDate = (data: any[]) => {
    const grouped: Record<string, any[]> = {};
    data.forEach((txn) => {
      const date = txn.date || 'Unknown Date';
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(txn);
    });
    return grouped;
  };

  const groupedTransactions = groupByDate(transactions);
  const totalSpent = transactions.reduce((sum, txn) => sum + parseFloat(txn.amount || 0), 0);
  const transactionCount = transactions.length;

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Transaction History
      </Text>

      {/* Filter Buttons (just visual for now) */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        {['All', 'This Week', 'This Month', 'Expenses Only'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              backgroundColor: filter === 'All' ? '#10B981' : '#E5E7EB',
              borderRadius: 20,
            }}
          >
            <Text style={{ color: filter === 'All' ? '#fff' : '#111827' }}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary Cards */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            padding: 16,
            flex: 1,
            marginRight: 8,
          }}
        >
          <Text style={{ color: '#6B7280', fontSize: 12 }}>Total Spent</Text>
          <Text style={{ fontSize: 20, color: '#DC2626', fontWeight: 'bold' }}>
            ${totalSpent.toFixed(2)}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            padding: 16,
            flex: 1,
            marginLeft: 8,
          }}
        >
          <Text style={{ color: '#6B7280', fontSize: 12 }}>Transactions</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>
            {transactionCount}
          </Text>
        </View>
      </View>

      {/* Transaction Groups */}
      {Object.entries(groupedTransactions).map(([date, txns]) => (
        <View key={date} style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 12 }}>{date}</Text>
          {(txns as any[]).map((item, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#F3F4F6',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#FEE2E2',
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <Text style={{ fontSize: 18 }}>💸</Text>
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
          ))}
        </View>
      ))}

      {/* Load More Button */}
      <TouchableOpacity
        style={{
          marginTop: 10,
          backgroundColor: '#F9FAFB',
          paddingVertical: 14,
          alignItems: 'center',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#E5E7EB',
        }}
      >
        <Text style={{ color: '#10B981', fontWeight: 'bold' }}>Load More Transactions</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
