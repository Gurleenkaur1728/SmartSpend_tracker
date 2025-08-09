import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getCurrentUser, updateUser, signOut,getSession } from '../utils/auth';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      if (u) { setName(u.name); setEmail(u.email); }
    })();
  }, []);

  const onSave = async () => {
    if (!name.trim()) return;
    const current = await getSession();
    if (!current) return;
    await updateUser(current,{ name: name.trim() });
    Alert.alert('Saved', 'Profile updated.');
  };

  const onLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 16 }}>Profile</Text>

      <Text style={{ marginBottom: 4 }}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 12 }}
      />

      <Text style={{ marginBottom: 4 }}>Email</Text>
      <TextInput
        value={email}
        editable={false}
        style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: '#F9FAFB', color: '#6B7280' }}
      />

      <TouchableOpacity onPress={onSave} style={{ backgroundColor: '#10B981', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onLogout} style={{ backgroundColor: '#EF4444', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 12 }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
