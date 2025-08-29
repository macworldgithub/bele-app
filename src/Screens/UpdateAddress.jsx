// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { ArrowLeft } from "lucide-react-native";

// const UpdateAddress = ({navigation}) => {
//   const [street, setStreet] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [zip, setZip] = useState("");

//   const handleUpdate = () => {
//     if (!street || !city || !state || !zip) {
//       alert("Please fill all fields");
//       return;
//     }

//     // Dynamic data payload
//     const newAddress = {
//       street,
//       city,
//       state,
//       zip,
//     };

//     console.log("Updated Address: ", newAddress);
//     alert("Service address updated successfully!");
//   };

//   return (
//     <ScrollView style={tw`flex-1 bg-white px-4 pt-8`}>
//       {/* Header */}
//       <View style={tw`flex-row items-center mb-4 py-4 `}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <ArrowLeft size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={tw`ml-3 text-lg font-semibold`}>Update Address</Text>
//       </View>

//       {/* Current Service Address */}
//       <View style={tw`bg-gray-100 rounded-xl p-4`}>
//         <View style={tw`flex-row items-center`}>
//           <Icon name="location-on" size={22} color="black" />
//           <Text style={tw`ml-2 font-semibold`}>Current Service Address</Text>
//         </View>
//         <Text style={tw`mt-2 text-gray-800`}>
//           123 Main St, Anytown, ST 12345
//         </Text>
//         <Text style={tw`text-gray-500 text-xs`}>Account #UC-2024-0789</Text>
//       </View>

//       {/* New Service Address */}
//       <View style={tw`bg-white rounded-xl p-4 mt-6 border border-gray-200`}>
//         <Text style={tw`font-semibold mb-2`}>New Service Address</Text>
//         <Text style={tw`text-xs text-gray-500 mb-4`}>
//           Enter your new address details. Service transfer will be effective next billing cycle.
//         </Text>

//         {/* Input Fields */}
//         <TextInput
//           style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
//           placeholder="Street Address"
//           value={street}
//           onChangeText={setStreet}
//         />
//         <TextInput
//           style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
//           placeholder="City"
//           value={city}
//           onChangeText={setCity}
//         />
//         <TextInput
//           style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
//           placeholder="State"
//           value={state}
//           onChangeText={setState}
//         />
//         <TextInput
//           style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
//           placeholder="ZIP Code"
//           keyboardType="numeric"
//           value={zip}
//           onChangeText={setZip}
//         />

//         {/* Note */}
//         <View style={tw`bg-gray-100 rounded-lg p-3 mb-4`}>
//           <Text style={tw`text-xs text-gray-600`}>
//             Note: Address changes may require a service visit to ensure proper connection at your new location. 
//             A $25 transfer fee may apply.
//           </Text>
//         </View>

//         {/* Submit Button */}
//         <TouchableOpacity
//           style={tw`bg-black py-3 rounded-xl`}
//           onPress={handleUpdate}
//         >
//           <Text style={tw`text-white text-center font-semibold`}>
//             Update Service Address
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Footer Note */}
//       <Text style={tw`text-xs text-gray-500 text-center mt-4 mb-6`}>
//         You'll receive confirmation via email and SMS once the update is processed
//       </Text>
//     </ScrollView>
//   );
// };

// export default UpdateAddress;
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import processQuery from '../utils/QueryProcessor';
import { getUsers, getAddresses, updateAddress } from '../utils/FileUtils';

const UpdateAddress = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params || {};
  const [user, setUser] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const users = await getUsers();
        const addresses = await getAddresses();
        const selectedUser = users.find(u => u.id === userId);
        const userAddress = addresses.find(a => a.userId === userId);
        if (!selectedUser) {
          console.error('User not found for userId:', userId);
          Alert.alert('Error', 'User not found. Please log in again.');
          navigation.replace('Login');
          return;
        }
        setUser(selectedUser);
        setCurrentAddress(userAddress ? userAddress.serviceAddress : 'No address found');
      } catch (error) {
        console.error('Error loading data:', error);
        Alert.alert('Error', 'Failed to load user data.');
        navigation.replace('Login');
      }
    };
    loadData();
  }, [userId, navigation]);

  const handleUpdate = async () => {
    if (!street || !city || !state || !zip) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    const newAddress = `${street}, ${city}, ${state} ${zip}`;
    try {
      const success = await updateAddress(userId, newAddress);
      if (success) {
        setCurrentAddress(newAddress);
        const result = await processQuery(`Change address to ${newAddress}`, 'addressUpdate', userId);
        setResponse(result.message);
        if (result.success) {
          Alert.alert('Success', 'Service address updated successfully!');
          setStreet('');
          setCity('');
          setState('');
          setZip('');
        } else {
          Alert.alert('Query Error', result.message);
        }
      } else {
        Alert.alert('Error', 'Failed to update address');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      Alert.alert('Error', 'Failed to update address.');
    }
  };

  const handleQuery = async () => {
    if (!query) {
      Alert.alert('Error', 'Please enter a query.');
      return;
    }
    try {
      const result = await processQuery(query, 'addressUpdate', userId);
      if (result.success) {
        const newAddress = query.match(/to\s+(.+)/i)?.[1] || 'new address';
        const success = await updateAddress(userId, newAddress);
        if (success) {
          setCurrentAddress(newAddress);
          setResponse(result.message);
          Alert.alert('Success', 'Service address updated successfully!');
        } else {
          Alert.alert('Error', 'Failed to update address');
        }
      } else {
        setResponse(result.message);
        Alert.alert('Query Error', result.message);
      }
    } catch (error) {
      console.error('Error processing query:', error);
      Alert.alert('Error', 'Failed to process query.');
    }
    setQuery('');
  };

  if (!user) return <Text>Loading...</Text>;

  return (
    <LinearGradient
      colors={['#fde047', '#f472b6', '#9333ea']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={tw`flex-1`}
    >
      <View style={tw`flex-1 items-center justify-center px-4 pt-8`}>
        <View style={tw`bg-white rounded-2xl w-full p-6`}>
          <Text style={tw`text-lg font-bold text-center mb-1`}>Update Address</Text>
          <Text style={tw`text-gray-600 text-center mb-5 text-xs`}>
            Update your service address or ask to change it
          </Text>

          <View style={tw`mb-4 border border-gray-300 rounded-lg p-3`}>
            <View style={tw`flex-row items-center`}>
              <Icon name="location-on" size={22} color="black" />
              <Text style={tw`ml-2 font-semibold`}>Current Service Address</Text>
            </View>
            <Text style={tw`mt-2 text-gray-800`}>{currentAddress}</Text>
            <Text style={tw`text-gray-500 text-xs`}>Account #{user.id}</Text>
          </View>

          <View style={tw`mb-4 border border-gray-300 rounded-lg p-3`}>
            <Text style={tw`font-semibold mb-2`}>New Service Address</Text>
            <Text style={tw`text-xs text-gray-500 mb-4`}>
              Enter your new address details or ask to update, e.g., "Change address to 123 New St"
            </Text>
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
            <TextInput
              style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
              placeholder="e.g., Change address to 123 New St"
              value={query}
              onChangeText={setQuery}
            />
            <TouchableOpacity 
              style={tw`bg-purple-600 py-3 rounded-xl mb-4`} 
              onPress={handleQuery}
            >
              <Text style={tw`text-white text-center font-semibold`}>Ask to Update</Text>
            </TouchableOpacity>
            {response && (
              <View style={tw`bg-gray-100 rounded-lg p-3 mb-4`}>
                <Text style={tw`text-sm text-gray-700`}>{response}</Text>
              </View>
            )}
            <TouchableOpacity 
              style={tw`bg-purple-600 py-3 rounded-xl`} 
              onPress={handleUpdate}
            >
              <Text style={tw`text-white text-center font-semibold`}>Update Service Address</Text>
            </TouchableOpacity>
          </View>

          <Text style={tw`text-gray-500 text-xs text-center mt-3`}>
            You'll receive confirmation via email and SMS
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default UpdateAddress;