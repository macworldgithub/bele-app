// import React from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { LinearGradient } from "expo-linear-gradient";
// import tw from "tailwind-react-native-classnames";

// const Login = () => {
//   const navigation = useNavigation();

//   return (
//     <LinearGradient
//       colors={["#fde047", "#f472b6", "#9333ea"]} // yellow → pink → purple
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={tw`flex-1`}
//     >
//       <View style={tw`flex-1 items-center justify-center px-6`}>
//         <View
//           style={[
//             tw`bg-white rounded-2xl shadow-lg p-6 w-full`,
//             { maxWidth: 320 },
//           ]}
//         >
//           <Text style={tw`text-xl font-bold text-center mb-2`}>
//             Secure Login
//           </Text>
//           <Text style={tw`text-gray-500 text-sm text-center mb-2`}>
//             Choose your preferred authentication method
//           </Text>

//           {/* Biometric Section */}
//           <View style={tw`items-center mb-4`}>
//             <Text style={tw`text-lg mb-2`}>🔐</Text>
//             <Text style={tw`text-base font-semibold text-center`}>
//               Biometric Authentication
//             </Text>
//             <Text style={tw`text-gray-500 text-xs text-center`}>
//               Touch the fingerprint sensor or use face recognition
//             </Text>
//           </View>

//           {/* Login Buttons */}
//           <TouchableOpacity
//             style={tw`bg-purple-500 py-3 rounded-lg mb-3`}
//             onPress={() => navigation.replace("Home")}
//           >
//             <Text style={tw`text-white text-center font-semibold`}>
//               Use Biometric Login
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={tw`border border-purple-400 py-3 rounded-lg`}
//             onPress={() => navigation.replace("PrivacyConsent")}
//           >
//             <Text style={tw`text-purple-500 text-center font-semibold`}>
//               Use PIN Instead
//             </Text>
//           </TouchableOpacity>

//           <Text style={tw`text-gray-400 text-xs text-center mt-4`}>
//             Your login attempts are logged for security purposes
//           </Text>
//         </View>
//       </View>
//     </LinearGradient>
//   );
// };

// export default Login;
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import * as FileSystem from 'expo-file-system';
import tw from 'tailwind-react-native-classnames';
import { getUsers } from '../utils/FileUtils';

const Login = () => {
  const navigation = useNavigation();
  const [hasBiometric, setHasBiometric] = useState(false);
  const [userIdInput, setUserIdInput] = useState('');

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setHasBiometric(compatible && enrolled);
    })();
  }, []);

  const logLoginAttempt = async (method, success, userId = 'unknown') => {
    const log = {
      timestamp: new Date().toISOString(),
      method,
      success,
      userId,
    };
    const logFile = `${FileSystem.documentDirectory}login_logs.json`;
    try {
      const existingLogs = await FileSystem.readAsStringAsync(logFile).catch(() => '[]');
      const logs = JSON.parse(existingLogs);
      logs.push(log);
      await FileSystem.writeAsStringAsync(logFile, JSON.stringify(logs));
    } catch (error) {
      console.error('Error logging login attempt:', error);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      // Check if any user has biometrics enrolled
      const users = await getUsers();
      const biometricUser = users.find(u => u.biometricEnrolled === true);
      if (!biometricUser) {
        await logLoginAttempt('biometric', false);
        Alert.alert('Error', 'No user with enrolled biometrics found. Please sign up with biometrics or use PIN.');
        return;
      }

      // Perform biometric authentication
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with biometrics to access Bele',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: false,
      });

      if (result.success) {
        await logLoginAttempt('biometric', true, biometricUser.id);
        navigation.replace('PrivacyConsent', { userId: biometricUser.id });
      } else {
        await logLoginAttempt('biometric', false, biometricUser.id);
        Alert.alert('Authentication Failed', 'Biometric did not match. Please try again or use PIN.');
      }
    } catch (error) {
      console.error('Biometric error:', error);
      await logLoginAttempt('biometric', false);
      Alert.alert('Error', 'Biometric authentication failed. Please try again or use PIN.');
    }
  };

  const handlePinLogin = async () => {
    if (!userIdInput) {
      Alert.alert('Error', 'Please enter your User ID.');
      return;
    }
    const users = await getUsers();
    const user = users.find(u => u.id === userIdInput);
    if (!user) {
      await logLoginAttempt('pin', false, userIdInput);
      Alert.alert('Error', 'Invalid User ID. Please try again or sign up.');
      return;
    }
    await logLoginAttempt('pin', true, user.id);
    navigation.replace('PrivacyConsent', { userId: user.id });
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
          <Text style={tw`text-xl font-bold text-center mb-2`}>Secure Login</Text>
          <Text style={tw`text-gray-500 text-sm text-center mb-2`}>
            Choose your preferred authentication method
          </Text>

          <View style={tw`items-center mb-4`}>
            <Text style={tw`text-lg mb-2`}>🔐</Text>
            <Text style={tw`text-base font-semibold text-center`}>
              Biometric Authentication
            </Text>
            <Text style={tw`text-gray-500 text-xs text-center`}>
              Touch the fingerprint sensor or use face recognition
            </Text>
          </View>

          <TouchableOpacity
            style={tw`bg-purple-500 py-3 rounded-lg mb-3`}
            onPress={handleBiometricLogin}
            disabled={!hasBiometric}
          >
            <Text style={tw`text-white text-center font-semibold`}>
              {hasBiometric ? 'Use Biometric Login' : 'Biometric Not Available'}
            </Text>
          </TouchableOpacity>

          <Text style={tw`text-base font-semibold text-center mt-4`}>PIN Login</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3 mt-2`}
            placeholder="Enter User ID (e.g., ACC12345)"
            value={userIdInput}
            onChangeText={setUserIdInput}
          />
          <TouchableOpacity
            style={tw`border border-purple-400 py-3 rounded-lg mb-3`}
            onPress={handlePinLogin}
          >
            <Text style={tw`text-purple-500 text-center font-semibold`}>Use PIN Instead</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`border border-purple-400 py-3 rounded-lg`}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={tw`text-purple-500 text-center font-semibold`}>Sign Up</Text>
          </TouchableOpacity>

          <Text style={tw`text-gray-400 text-xs text-center mt-4`}>
            Your login attempts are logged for security purposes
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Login;