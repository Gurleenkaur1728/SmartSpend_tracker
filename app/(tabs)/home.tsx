import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { getTransactions, Transaction } from '../utils/storage';
import { getCurrentUser } from '../utils/auth';

export default function HomeScreen() {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [name, setName] = useState<string>('User');

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
    if (u?.name) setName(u.name);
      setTxs(await getTransactions());
    })();
  }, []);
      

  const balance = txs.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0);
  const month = new Date().getMonth(), year = new Date().getFullYear();
  const monthTxs = txs.filter(t => {
    const d = new Date(t.date); return d.getMonth()===month && d.getFullYear()===year;
  });
  const income = monthTxs.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const expense = monthTxs.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);

  

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Hi {name} 👋</Text>
      <View style={{ backgroundColor: '#10B981', padding: 16, borderRadius: 12, marginBottom: 16 }}>
        <Text style={{ color: 'white' }}>Current Balance</Text>
        <Text style={{ color: 'white', fontSize: 28, fontWeight: '800' }}>${balance.toFixed(2)}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        <View style={{ flex: 1, backgroundColor: '#ECFDF5', padding: 16, borderRadius: 12 }}>
          <Text style={{ color: '#065F46', fontSize: 12 }}>Income (this month)</Text>
          <Text style={{ color: '#065F46', fontSize: 20, fontWeight: '700' }}>${income.toFixed(2)}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12 }}>
          <Text style={{ color: '#991B1B', fontSize: 12 }}>Expenses (this month)</Text>
          <Text style={{ color: '#991B1B', fontSize: 20, fontWeight: '700' }}>${expense.toFixed(2)}</Text>
        </View>
      </View>

      <View style={{ marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Recent</Text>
        <Link href="/history" asChild>
          <TouchableOpacity><Text style={{ color: '#10B981' }}>See all</Text></TouchableOpacity>
        </Link>
      </View>

      {txs.slice(0, 8).map(t => (
        <View key={t.id} style={{ borderWidth: 1, borderColor: '#E5E7EB', padding: 12, borderRadius: 10, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: '#374151' }}>{t.category}</Text>
          <Text style={{ color: t.type==='income' ? '#065F46' : '#991B1B', fontWeight: '700' }}>
            {t.type==='income' ? '+' : '-'}${t.amount.toFixed(2)}
          </Text>
        </View>
      ))}

      <Link href="/add-expense" asChild>
        <TouchableOpacity style={{ marginTop: 12, backgroundColor: '#10B981', padding: 14, borderRadius: 8, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Add Transaction</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}
