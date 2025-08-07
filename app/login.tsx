import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Please enter email and password');
      return;
    }

    const saved = await AsyncStorage.getItem('user');
    if (!saved) {
      Alert.alert('No account found. Please sign up first.');
      return;
    }

    const user = JSON.parse(saved);
    if (email === user.email && password === user.password) {
      router.replace('/home');
    } else {
      Alert.alert('Incorrect credentials');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24 }}>SmartSpend Login</Text>

      <Text style={{ marginBottom: 6 }}>Email</Text>
      <TextInput
        placeholder="example@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: '#D1D5DB',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />

      <Text style={{ marginBottom: 6 }}>Password</Text>
      <TextInput
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: '#D1D5DB',
          borderRadius: 8,
          padding: 12,
          marginBottom: 24,
        }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: '#10B981',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/signup')}
        style={{ marginTop: 16, alignItems: 'center' }}
      >
        <Text style={{ color: '#10B981' }}>Do not have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}
