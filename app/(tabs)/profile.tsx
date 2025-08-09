// app/profile.tsx
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser, updateUser, signOut, getSession } from '../utils/auth';

// Adjust the logo path if your assets folder differs
import Logo from '../../assets/images/Smartspend-logo.png';

const colors = {
  primary: '#10B981',
  secondary: '#059669',
  border: '#E5E7EB',
  text: '#111827',
  subtext: '#6B7280',
  bg: '#F9FAFB',
  white: '#FFFFFF',
  danger: '#EF4444',
  card: '#FFFFFF',
  shadow: 'rgba(17,24,39,0.06)',
  inputBg: '#F3F4F6',
};

const THEME_KEY = 'pref_theme'; // 'light' | 'dark'

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // theme
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const u = await getCurrentUser();
        if (u) {
          setName(u.name ?? '');
          setEmail(u.email ?? '');
        }
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        setIsDark(savedTheme === 'dark');
      } catch (e) {
        console.warn('Profile init error', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }

    try {
      setSaving(true);
      const current = await getSession();
      if (!current) {
        Alert.alert('Session expired', 'Please log in again.');
        router.replace('/login');
        return;
      }
      await updateUser(current, { name: trimmed });
      await AsyncStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
      Alert.alert('Saved', 'Your profile has been updated.');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not save your changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const onLogout = async () => {
    try {
      await signOut();
    } catch {
      // ignore
    } finally {
      router.replace('/login');
    }
  };

  const initials = useMemo(() => {
    if (!name?.trim()) return 'S';
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('');
  }, [name]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      {/* Header / Logo */}
      <View style={styles.header}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Account Card */}
      <View style={styles.card}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Account</Text>
            <Text style={styles.cardSub}>{email || '—'}</Text>
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            style={styles.input}
            placeholderTextColor={colors.subtext}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            editable={false}
            style={[styles.input, styles.inputDisabled]}
          />
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.row}>
          <View>
            <Text style={styles.rowTitle}>Dark Mode</Text>
            <Text style={styles.rowSub}>Reduce glare and use darker UI</Text>
          </View>
          <Switch value={isDark} onValueChange={setIsDark} />
        </View>
      </View>

      {/* Actions */}
      <TouchableOpacity
        disabled={saving}
        onPress={onSave}
        style={[styles.button, styles.buttonPrimary, saving && { opacity: 0.7 }]}
      >
        <Text style={styles.buttonText}>{saving ? 'Saving…' : 'Save Changes'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onLogout} style={[styles.button, styles.buttonDanger]}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 180,
    height: 60,
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 18,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  cardSub: {
    fontSize: 13,
    color: colors.subtext,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: colors.subtext,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.inputBg,
    color: colors.text,
  },
  inputDisabled: {
    backgroundColor: '#F9FAFB',
    color: colors.subtext,
  },
  row: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  rowSub: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 2,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700',
  },
});
