import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { ArrowLeft } from "lucide-react-native";

const BillQuery = ({ navigation }) => {
  const [billItems] = useState([
    { label: "Previous Balance", amount: 0.0 },
    { label: "Service Charge (May 1–31)", amount: 85.5 },
    { label: "Service Charge (Duplicate)", amount: 85.5, highlight: true },
    { label: "Taxes & Fees", amount: 12.28 },
  ]);

  const total = billItems.reduce((acc, item) => acc + item.amount, 0);

  return (
    <ScrollView style={tw`flex-1 bg-white px-4 pt-8 `}>
      {/* Header */}
      <View style={tw`flex-row items-center mb-4 py-4 `}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`ml-3 text-lg font-semibold`}>Bill Query</Text>
      </View>

      {/* Current Bill Card */}
      <View style={tw`bg-white rounded-xl shadow p-4 mb-6 border border-gray-300`}>
        <Text style={tw`text-base font-semibold mb-3`}>
          Current Bill - May 2024
        </Text>
        {billItems.map((item, index) => (
          <View
            key={index}
            style={tw`flex-row justify-between items-center py-2 border-b border-gray-200`}
          >
            <Text
              style={[
                tw`text-sm text-gray-700`,
                item.highlight && { color: "red", fontWeight: "600" },
              ]}
            >
              {item.label}
            </Text>
            <Text
              style={[
                tw`text-sm font-medium`,
                item.highlight && { color: "red" },
              ]}
            >
              ${item.amount.toFixed(2)}
            </Text>
          </View>
        ))}
        <View style={tw`flex-row justify-between items-center pt-3`}>
          <Text style={tw`text-sm font-semibold`}>Total Amount Due</Text>
          <Text style={tw`text-sm font-semibold`}>${total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Ask About Bill Section */}
      <View style={tw`bg-white rounded-xl shadow p-4 mb-6 border border-gray-300`}>
        <Text style={tw`text-base font-semibold mb-2`}>Ask About Your Bill</Text>
        <Text style={tw`text-xs text-gray-500 mb-3`}>
          Describe your billing question or concern, and we'll investigate
        </Text>

        {/* Input Box */}
        <Text style={tw`text-xs text-gray-700 mb-1`}>Your Question</Text>
        <TextInput
          placeholder="e.g., I notice a duplicate charge..."
          style={tw`border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4`}
          multiline
          numberOfLines={4}
        />

        {/* Common Issues */}
        <Text style={tw`text-xs text-gray-500 mb-2`}>
          Common Issues We Can Help With:
        </Text>
        <View style={tw`pl-2`}>
          {[
            "Duplicate or incorrect charges.",
            "Unexpectedly high bills.",
            "Payment processing questions.",
            "Service date discrepancies.",
            "Tax and fee explanations.",
          ].map((issue, i) => (
            <Text key={i} style={tw`text-xs text-gray-600 mb-1`}>
              • {issue}
            </Text>
          ))}
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={tw`bg-black py-3 rounded-xl mb-4`}>
        <Text style={tw`text-center text-white font-semibold`}>
          Submit Query
        </Text>
      </TouchableOpacity>

      <Text style={tw`text-center text-xs text-gray-500 mb-6`}>
        You'll receive a response within 24–48 hours via email or phone
      </Text>
    </ScrollView>
  );
};

// export default BillQuery;
// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import tw from 'tailwind-react-native-classnames';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import processQuery from '../utils/QueryProcessor';
// import { getUsers } from '../utils/FileUtils';

// const BillQuery = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { userId } = route.params || {};
//   const [user, setUser] = useState(null);
//   const [query, setQuery] = useState('');
//   const [response, setResponse] = useState('');

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const users = await getUsers();
//         const selectedUser = users.find(u => u.id === userId);
//         if (!selectedUser) {
//           console.error('User not found for userId:', userId);
//           Alert.alert('Error', 'User not found. Please log in again.');
//           navigation.replace('Login');
//           return;
//         }
//         setUser(selectedUser);
//       } catch (error) {
//         console.error('Error loading user data:', error);
//         Alert.alert('Error', 'Failed to load user data.');
//         navigation.replace('Login');
//       }
//     };
//     loadData();
//   }, [userId, navigation]);

//   const handleQuery = async () => {
//     if (!query) {
//       Alert.alert('Error', 'Please enter a query.');
//       return;
//     }
//     try {
//       const result = await processQuery(query, 'billQuery', userId);
//       setResponse(result.message);
//       if (!result.success) {
//         Alert.alert('Query Error', result.message);
//       }
//     } catch (error) {
//       console.error('Error processing query:', error);
//       Alert.alert('Error', 'Failed to process query.');
//     }
//     setQuery('');
//   };

//   if (!user) return <Text>Loading...</Text>;

//   const billItems = user.bill.items;
//   const total = billItems.reduce((acc, item) => acc + item.amount, 0);

//   return (
//     <LinearGradient
//       colors={['#fde047', '#f472b6', '#9333ea']}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={tw`flex-1`}
//     >
//       <View style={tw`flex-1 items-center justify-center px-4 pt-8`}>
//         <View style={tw`bg-white rounded-2xl w-full p-6`}>
//           <Text style={tw`text-lg font-bold text-center mb-1`}>Bill Query</Text>
//           <Text style={tw`text-gray-600 text-center mb-5 text-xs`}>
//             View your bill details or ask about your bill
//           </Text>

//           <View style={tw`mb-4 border border-gray-300 rounded-lg p-3`}>
//             <Text style={tw`font-semibold mb-2`}>Current Bill - {user.bill.month}</Text>
//             {billItems.map((item, index) => (
//               <View
//                 key={index}
//                 style={tw`flex-row justify-between items-center py-2 border-b border-gray-200`}
//               >
//                 <Text
//                   style={[tw`text-sm text-gray-700`, item.highlight && { color: 'red', fontWeight: '600' }]}
//                 >
//                   {item.label}
//                 </Text>
//                 <Text style={[tw`text-sm font-medium`, item.highlight && { color: 'red' }]}>
//                   ${item.amount.toFixed(2)}
//                 </Text>
//               </View>
//             ))}
//             <View style={tw`flex-row justify-between items-center pt-3`}>
//               <Text style={tw`text-sm font-semibold`}>Total Amount Due</Text>
//               <Text style={tw`text-sm font-semibold`}>${total.toFixed(2)}</Text>
//             </View>
//           </View>

//           <View style={tw`mb-4 border border-gray-300 rounded-lg p-3`}>
//             <Text style={tw`font-semibold mb-2`}>Ask About Your Bill</Text>
//             <Text style={tw`text-xs text-gray-500 mb-3`}>
//               Describe your billing question or concern, e.g., "Why was my bill high?" or "Duplicate charge"
//             </Text>
//             <TextInput
//               placeholder="e.g., Why was my May bill high?"
//               style={tw`border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4`}
//               multiline
//               numberOfLines={4}
//               value={query}
//               onChangeText={setQuery}
//             />
//             <TouchableOpacity 
//               style={tw`bg-purple-600 py-3 rounded-xl mb-4`} 
//               onPress={handleQuery}
//             >
//               <Text style={tw`text-center text-white font-semibold`}>Submit Query</Text>
//             </TouchableOpacity>
//             {response && (
//               <View style={tw`bg-gray-100 rounded-lg p-3`}>
//                 <Text style={tw`text-sm text-gray-700`}>{response}</Text>
//               </View>
//             )}
//             <Text style={tw`text-xs text-gray-500 mb-2 mt-3`}>Common Issues We Can Help With:</Text>
//             <View style={tw`pl-2`}>
//               {[
//                 'Duplicate or incorrect charges.',
//                 'Unexpectedly high bills.',
//                 'Payment processing questions.',
//                 'Service date discrepancies.',
//                 'Tax and fee explanations.',
//               ].map((issue, i) => (
//                 <Text key={i} style={tw`text-xs text-gray-600 mb-1`}>• {issue}</Text>
//               ))}
//             </View>
//           </View>

//           <Text style={tw`text-gray-500 text-xs text-center mt-3`}>
//             You'll receive a response within 24–48 hours via email or phone
//           </Text>
//         </View>
//       </View>
//     </LinearGradient>
//   );
// };

// export default BillQuery;