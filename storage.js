//import { AsyncStorage } from "react-native-community/AsyncStorage";
//import { AsyncStorage } from "@react-native-async-storage/async-storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function writeStorage( key, value) {
  try {
    await AsyncStorage.setItem(key, value);
		return Promise.resolve(true);
  } catch (error) {
    ; // Error writing data
  }
	return Promise.reject('An error occured when storing a key-value pair!');
}

export async function readStorage(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
			return Promise.resolve(value);
    }
  } catch (error) {
		;	// Error reading data
  }
	return Promise.reject('An error occured when reading a key-value pair!');
}

export async function readAllStorage() {
  try {
		let psettings = await Promise.all([
			AsyncStorage.getItem('server'), 
			AsyncStorage.getItem('port'), 
			AsyncStorage.getItem('user'),
			AsyncStorage.getItem('password'), 
			AsyncStorage.getItem('lang')
		]);
    if (psettings !== null) {
			return Promise.resolve({ 
				server:psettings[0], port:psettings[1], user:psettings[2], 
				password: psettings[3], lang: psettings[4] 
			});
    }
  } catch (error) {
		;	// Error reading data
  }
	return Promise.reject('An error occured when reading a key-value pair!');
}

export async function writePersistentSettings( psettings ) {
  try {
		await Promise.all([
			AsyncStorage.setItem('server', psettings.server), 
			AsyncStorage.getItem('port', psettings.port),
			AsyncStorage.getItem('user', psettings.user),
			AsyncStorage.getItem('password', psettings.passowrd), 
			AsyncStorage.getItem('lang', psettings.lang)
		]);
		return Promise.resolve(true);
  } catch (error) {
		;	// Error reading data
  }
	return Promise.reject('An error occured when reading a key-value pair!');
}