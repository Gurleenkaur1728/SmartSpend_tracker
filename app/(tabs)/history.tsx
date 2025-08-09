import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { getTransactions, Transaction } from '../utils/storage';

export default function HistoryScreen() {
  const [txs, setTxs] = useState<Transaction[]>([]);

  useEffect(() => {
    (async () => {
      setTxs(await getTransactions());
    })();
  }, []);

  const groups: Record<string, Transaction[]> = txs.reduce((acc, t) => {
    const key = new Date(t.date).toDateString();
    acc[key] = acc[key] || [];
    acc[key].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 16 }}>History</Text>
      {Object.entries(groups).map(([date, list]) => (
        <View key={date} style={{ marginBottom: 12 }}>
          <Text style={{ color: '#6B7280', marginBottom: 6 }}>{date}</Text>
          {list.map(t => (
            <View key={t.id} style={{ borderWidth: 1, borderColor: '#E5E7EB', padding: 12, borderRadius: 10, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#374151' }}>{t.category}{t.description ? ' - '+t.description : ''}</Text>
              <Text style={{ color: t.type==='income' ? '#065F46' : '#991B1B', fontWeight: '700' }}>
                {t.type==='income' ? '+' : '-'}${t.amount.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      ))}
      {txs.length === 0 && <Text style={{ color: '#6B7280' }}>No transactions yet.</Text>}
    </ScrollView>
  );
}
