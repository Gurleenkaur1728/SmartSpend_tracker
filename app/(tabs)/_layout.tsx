import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { getSession } from '../utils/auth';

export default function TabsLayout() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const check = async () => {
      const session = await getSession();
      if (active && !session) router.replace('/login');
    };

    check();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') check();
    });

    return () => {
      active = false;
      sub.remove();
    };
  }, []);

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="add-expense" options={{ title: 'Add' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
