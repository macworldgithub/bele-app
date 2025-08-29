import * as FileSystem from 'expo-file-system';

const addressesFile = `${FileSystem.documentDirectory}addresses.json`;
const usersFile = `${FileSystem.documentDirectory}users.json`;

const initializeData = async () => {
  try {
    const assetsAddresses = require('../../assets/data/addresses.json');
    const assetsUsers = require('../../assets/data/users.json');
    
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory, { intermediates: true });

    const addressesExists = await FileSystem.getInfoAsync(addressesFile);
    if (!addressesExists.exists) {
      console.log(`Initializing addresses.json in ${FileSystem.documentDirectory}`);
      await FileSystem.writeAsStringAsync(addressesFile, JSON.stringify(assetsAddresses));
    }
    
    const usersExists = await FileSystem.getInfoAsync(usersFile);
    if (!usersExists.exists) {
      console.log(`Initializing users.json in ${FileSystem.documentDirectory}`);
      await FileSystem.writeAsStringAsync(usersFile, JSON.stringify(assetsUsers));
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

const getAddresses = async () => {
  try {
    const data = await FileSystem.readAsStringAsync(addressesFile);
    const addresses = JSON.parse(data);
    console.log(`Loaded addresses: ${JSON.stringify(addresses)}`);
    return addresses;
  } catch (error) {
    console.error('Error reading addresses:', error);
    const fallback = require('../../assets/data/addresses.json');
    console.log(`Falling back to assets addresses: ${JSON.stringify(fallback)}`);
    return fallback;
  }
};

const updateAddress = async (userId, newAddress) => {
  try {
    const addresses = await getAddresses();
    const index = addresses.findIndex(addr => addr.userId === userId);
    if (index !== -1) {
      addresses[index].serviceAddress = newAddress;
    } else {
      addresses.push({ userId, serviceAddress: newAddress });
    }
    await FileSystem.writeAsStringAsync(addressesFile, JSON.stringify(addresses));
    console.log(`Updated address for userId ${userId}: ${newAddress}`);
    return true;
  } catch (error) {
    console.error('Error updating address:', error);
    return false;
  }
};

const getUsers = async () => {
  try {
    const data = await FileSystem.readAsStringAsync(usersFile);
    const users = JSON.parse(data);
    console.log(`Loaded users: ${JSON.stringify(users)}`);
    return users;
  } catch (error) {
    console.error('Error reading users:', error);
    const fallback = require('../../assets/data/users.json');
    console.log(`Falling back to assets users: ${JSON.stringify(fallback)}`);
    return fallback;
  }
};

const addUser = async (newUser) => {
  try {
    const users = await getUsers();
    users.push(newUser);
    await FileSystem.writeAsStringAsync(usersFile, JSON.stringify(users));
    console.log(`Added user: ${JSON.stringify(newUser)}`);
    return true;
  } catch (error) {
    console.error('Error adding user:', error);
    return false;
  }
};

export { initializeData, getAddresses, updateAddress, getUsers, addUser };