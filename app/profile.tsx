import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();

  const [name, setName] = useState('Gurleen');
  const [email, setEmail] = useState('gurleen@example.com');
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState('green');
  const [language, setLanguage] = useState('english');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(false);

  useEffect(() => {
    // Load saved profile settings
    const loadSettings = async () => {
      const data = await AsyncStorage.getItem('profileSettings');
      if (data) {
        const parsed = JSON.parse(data);
        setName(parsed.name);
        setEmail(parsed.email);
        setDarkMode(parsed.darkMode);
        setTheme(parsed.theme);
        setLanguage(parsed.language);
        setEmailAlerts(parsed.emailAlerts);
        setWeeklySummary(parsed.weeklySummary);
        setPinEnabled(parsed.pinEnabled);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    // Auto-save settings when changed
    const saveSettings = async () => {
      const settings = {
        name,
        email,
        darkMode,
        theme,
        language,
        emailAlerts,
        weeklySummary,
        pinEnabled,
      };
      await AsyncStorage.setItem('profileSettings', JSON.stringify(settings));
    };
    saveSettings();
  }, [name, email, darkMode, theme, language, emailAlerts, weeklySummary, pinEnabled]);

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      {/* Avatar */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#10B981',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 32, color: '#fff', fontWeight: 'bold' }}>
            {name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={{ marginTop: 8, fontWeight: 'bold' }}>{name}</Text>
      </View>

      {/* Account Info */}
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Account Info</Text>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 12, color: '#6B7280' }}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={{
            borderWidth: 1,
            borderColor: '#D1D5DB',
            padding: 12,
            borderRadius: 8,
            marginBottom: 10,
          }}
        />
        <Text style={{ fontSize: 12, color: '#6B7280' }}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: '#D1D5DB',
            padding: 12,
            borderRadius: 8,
          }}
        />
      </View>

      {/* Preferences */}
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Preferences</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Theme</Text>
      <View style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, marginBottom: 12 }}>
        <Picker selectedValue={theme} onValueChange={setTheme}>
          <Picker.Item label="Green (Default)" value="green" />
          <Picker.Item label="Blue" value="blue" />
          <Picker.Item label="Purple" value="purple" />
        </Picker>
      </View>

      <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Language</Text>
      <View style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, marginBottom: 20 }}>
        <Picker selectedValue={language} onValueChange={setLanguage}>
          <Picker.Item label="English" value="english" />
          <Picker.Item label="French" value="french" />
          <Picker.Item label="Hindi" value="hindi" />
        </Picker>
      </View>

      {/* Notifications */}
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Notifications</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text>Email Alerts</Text>
        <Switch value={emailAlerts} onValueChange={setEmailAlerts} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <Text>Weekly Summary</Text>
        <Switch value={weeklySummary} onValueChange={setWeeklySummary} />
      </View>

      {/* Security */}
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Security</Text>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: '#D1D5DB',
          borderRadius: 8,
          padding: 14,
          alignItems: 'center',
          marginBottom: 12,
        }}
        onPress={() => Alert.alert('Change Password', 'This feature is coming soon!')}
      >
        <Text>Change Password</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <Text>Enable PIN</Text>
        <Switch value={pinEnabled} onValueChange={setPinEnabled} />
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={{
          backgroundColor: '#EF4444',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
        }}
        onPress={handleLogout}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
