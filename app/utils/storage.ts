import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'transactions';

export const saveTransaction = async (transaction: any) => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const data = existing ? JSON.parse(existing) : [];
    data.unshift(transaction); // add new at the top
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving transaction:', error);
  }
};

export const getTransactions = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

export const clearTransactions = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
