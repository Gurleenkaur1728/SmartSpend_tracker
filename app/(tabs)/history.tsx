import { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getTransactions, Transaction } from '../utils/storage';
import Logo from '../../assets/images/Smartspend-logo.png'; // adjust if your path differs

const colors = {
  primary: '#10B981',
  secondary: '#059669',
  border: '#E5E7EB',
  text: '#111827',
  subtext: '#6B7280',
  bg: '#F9FAFB',
  white: '#FFFFFF',
  danger: '#EF4444',
};

type RangeKey = 'all' | 'week' | 'month';

export default function HistoryScreen() {
  const [txs, setTxs] = useState<Transaction[]>([]);

  // FILTER STATE
  const [range, setRange] = useState<RangeKey>('month');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [category, setCategory] = useState<string>(''); // '' = all

  // Refresh every time screen gains focus (so new txs appear)
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        const data = await getTransactions();
        if (alive) setTxs(data);
      })();
      return () => { alive = false; };
    }, [])
  );

  // Compute date range
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekStart = startOfWeek(now);
  const fromDate = range === 'all' ? new Date(2000, 0, 1) : range === 'week' ? weekStart : monthStart;
  const toDate = now;

  // Unique categories for chips (from your actual data)
  const categories = useMemo(() => {
    const set = new Set<string>();
    txs.forEach(t => t.category && set.add(t.category));
    return Array.from(set).sort();
  }, [txs]);

  // Apply filters
  const filtered = useMemo(() => {
    return txs.filter(t => {
      const d = new Date(t.date);
      const inRange = d >= stripTime(fromDate) && d <= endOfDay(toDate);
      const catOK = !category || (t.category || '').toLowerCase() === category.toLowerCase();
      const typeOK = typeFilter === 'all' ? true : t.type === typeFilter;
      return inRange && catOK && typeOK;
    });
  }, [txs, fromDate, toDate, category, typeFilter]);

  // Summary values based on filtered list
  const totalSpent = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Header with BIG logo */}
      <View style={styles.header}>
        <Image source={Logo} style={{ width: 250, height: 100 }} resizeMode="contain" />
        <Text style={styles.headerSub}>Transaction History</Text>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 16 }}>
        {/* Filters */}
        <View style={styles.card}>
          <Text style={styles.h3}>Filters</Text>

          {/* Date range display (auto from system) */}
          <View style={styles.grid2}>
            <Field label="From" value={formatInputDate(fromDate)} />
            <Field label="To" value={formatInputDate(toDate)} />
          </View>

          {/* Quick range chips */}
          <View style={styles.chipRow}>
            <Chip text="All" active={range==='all'} onPress={() => setRange('all')} />
            <Chip text="This Week" active={range==='week'} onPress={() => setRange('week')} />
            <Chip text="This Month" active={range==='month'} onPress={() => setRange('month')} />
          </View>

          {/* Type chips */}
          <View style={[styles.chipRow, { marginTop: 8 }]}>
            <Chip text="All Types" active={typeFilter==='all'} onPress={() => setTypeFilter('all')} />
            <Chip text="Expenses Only" active={typeFilter==='expense'} onPress={() => setTypeFilter('expense')} />
            <Chip text="Income Only" active={typeFilter==='income'} onPress={() => setTypeFilter('income')} />
          </View>

          {/* Category chips (from data) */}
          {!!categories.length && (
            <>
              <Text style={[styles.label, { marginTop: 12 }]}>Category</Text>
              <View style={styles.chipRow}>
                <Chip text="All Categories" active={!category} onPress={() => setCategory('')} />
                {categories.map(c => (
                  <Chip key={c} text={c} active={category.toLowerCase()===c.toLowerCase()} onPress={() => setCategory(c)} />
                ))}
              </View>
            </>
          )}
        </View>

        {/* Summary */}
        <View style={styles.grid2}>
          <View style={styles.card}>
            <Text style={styles.sub}>Total Spent</Text>
            <Text style={[styles.total, { color: colors.danger }]}>-${totalSpent.toFixed(2)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.sub}>Transactions</Text>
            <Text style={styles.total}>{filtered.length}</Text>
          </View>
        </View>

        {/* Transaction List */}
        <View style={styles.card}>
          <Text style={styles.h3}>Results</Text>
          {filtered.map((t, idx) => (
            <View key={t.id}>
              <View style={styles.txnRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[
                    styles.emojiCircle,
                    { backgroundColor: t.type === 'income' ? '#DCFCE7' : '#FEE2E2' },
                  ]}>
                    <Text>{pickEmoji(t.category, t.type)}</Text>
                  </View>
                  <View>
                    <Text style={styles.bold}>{t.category || (t.type === 'income' ? 'Income' : 'Expense')}</Text>
                    <Text style={styles.subSmall}>{formatDate(t.date)}</Text>
                  </View>
                </View>
                <Text style={{ fontWeight: '700', color: t.type === 'income' ? '#065F46' : colors.danger }}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                </Text>
              </View>
              {idx < filtered.length - 1 && <View style={styles.divider} />}
            </View>
          ))}

          <TouchableOpacity style={styles.loadMore}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>Load More Transactions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

/* ----- UI bits ----- */

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.input}><Text style={styles.text}>{value}</Text></View>
    </View>
  );
}

function Chip({ text, active, onPress }:{ text:string; active?:boolean; onPress?:()=>void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.chip, { backgroundColor: active ? colors.primary : '#F3F4F6' }]}>
        <Text style={{ color: active ? '#fff' : '#374151', fontSize: 12, fontWeight: '600' }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

/* ----- helpers ----- */

function pickEmoji(category?: string, type?: string) {
  const key = (category || '').toLowerCase();
  if (type === 'income') return '💰';
  if (key.includes('food') || key.includes('dining')) return '🍕';
  if (key.includes('coffee')) return '☕';
  if (key.includes('transport') || key.includes('gas')) return '⛽';
  if (key.includes('shop')) return '🛍️';
  if (key.includes('entertain')) return '🎬';
  if (key.includes('grocery')) return '🏪';
  return '💳';
}

function formatDate(d: string) {
  try { return new Date(d).toLocaleDateString(); } catch { return d; }
}
function formatInputDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}

function startOfWeek(d: Date) {
  const tmp = new Date(d);
  const day = (tmp.getDay()+6) % 7; // make Monday=0
  tmp.setDate(tmp.getDate() - day);
  return stripTime(tmp);
}
function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23,59,59,999);
}

/* ----- styles ----- */

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSub: { fontSize: 12, color: colors.subtext, marginTop: 2 },

  h3: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 8 },
  sub: { fontSize: 12, color: colors.subtext },
  subSmall: { fontSize: 12, color: colors.subtext },
  text: { fontSize: 14, color: colors.text },
  bold: { fontSize: 14, color: colors.text, fontWeight: '700' },
  total: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 4 },
  label: { fontSize: 12, color: colors.text, fontWeight: '600', marginBottom: 6 },

  card: { backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 },
  grid2: { flexDirection: 'row', gap: 12, marginTop: 8 },
  input: { backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, minWidth: 140 },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },

  txnRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  emojiCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  divider: { height: 1, backgroundColor: colors.border },
  loadMore: { borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
});
