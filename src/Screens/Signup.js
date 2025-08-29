import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import tw from 'tailwind-react-native-classnames';
import { addUser, updateAddress, getUsers } from '../utils/FileUtils';

const SignUp = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  const generateUniqueUserId = async () => {
    const users = await getUsers();
    let userId;
    do {
      userId = `ACC${Math.floor(10000 + Math.random() * 90000)}`;
    } while (users.some(u => u.id === userId));
    return userId;
  };

  const handleSignUp = async () => {
    if (!name || !email || !street || !city || !state || !zip) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // Check biometric support and prompt for enrollment
    let biometricEnrolled = false;
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (compatible) {
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const promptMessage = enrolled
        ? 'Confirm biometric for Bele account'
        : 'Enroll biometric for Bele (required for biometric login)';
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Skip Biometric',
        disableDeviceFallback: false,
      });
      if (result.success) {
        biometricEnrolled = true;
        Alert.alert('Success', 'Biometric enrolled successfully!');
      } else {
        Alert.alert('Biometric Enrollment', 'Biometric setup skipped. You can use PIN login.');
      }
    } else {
      Alert.alert('Warning', 'Biometric hardware not available. You can use PIN login.');
    }

    // Generate unique user ID
    const userId = await generateUniqueUserId();

    // Create new user
    const newUser = {
      id: userId,
      name,
      plan: 'Basic Plan',
      speed: 'Up to 25 Mbps',
      status: 'Active',
      expiry: 'June 30, 2026',
      dataUsed: 0,
      dataLimit: 5,
      biometricEnrolled,
      bill: {
        month: 'May 2024',
        items: [
          { label: 'Service Charge', amount: 30.0 },
          { label: 'Taxes & Fees', amount: 5.0 }
        ],
        dueDate: 'June 15, 2024',
        disputeNotice: false
      }
    };

    // Save user
    const userSaved = await addUser(newUser);
    if (!userSaved) {
      Alert.alert('Error', 'Failed to create user');
      return;
    }

    // Save address
    const newAddress = `${street}, ${city}, ${state} ${zip}`;
    const addressSaved = await updateAddress(userId, newAddress);
    if (!addressSaved) {
      Alert.alert('Error', 'Failed to save address');
      return;
    }

    Alert.alert('Success', `Sign-up complete! Your User ID is ${userId}. Please log in.`);
    navigation.replace('Login');
  };

  return (
    <LinearGradient
      colors={['#fde047', '#f472b6', '#9333ea']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={tw`flex-1`}
    >
      <View style={tw`flex-1 items-center justify-center px-6`}>
        <View style={[tw`bg-white rounded-2xl shadow-lg p-6 w-full`, { maxWidth: 320 }]}>
          <Text style={tw`text-xl font-bold text-center mb-2`}>Sign Up</Text>
          <Text style={tw`text-gray-500 text-sm text-center mb-4`}>
            Create a new account to access Bele services
          </Text>

          <TextInput
            style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
            placeholder="Street Address"
            value={street}
            onChangeText={setStreet}
          />
          <TextInput
            style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
            placeholder="State"
            value={state}
            onChangeText={setState}
          />
          <TextInput
            style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
            placeholder="ZIP Code"
            keyboardType="numeric"
            value={zip}
            onChangeText={setZip}
          />

          <TouchableOpacity
            style={tw`bg-purple-500 py-3 rounded-lg mb-3`}
            onPress={handleSignUp}
          >
            <Text style={tw`text-white text-center font-semibold`}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`border border-purple-400 py-3 rounded-lg`}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={tw`text-purple-500 text-center font-semibold`}>Back to Login</Text>
          </TouchableOpacity>

          <Text style={tw`text-gray-400 text-xs text-center mt-4`}>
            Your data is securely stored and protected. Biometric enrollment is required for biometric login.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default SignUp;