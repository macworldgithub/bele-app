// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { ArrowLeft } from "lucide-react-native";
// const CoverageCheck = ({navigation}) => {
//   const [zip, setZip] = useState("");

//   const quickZips = ["12345", "6789", "1111", "9999"];

//   const handleCheck = () => {
//     if (!zip) {
//       alert("Please enter a ZIP code or address");
//       return;
//     }
//     console.log("Checking coverage for:", zip);
//     alert(`Checking coverage for: ${zip}`);
//   };

//   return (
//     <ScrollView style={tw`flex-1 bg-white px-4 pt-8`}>
//       {/* Header */}
//       <View style={tw`flex-row items-center mb-4 py-4 `}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <ArrowLeft size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={tw`ml-3 text-lg font-semibold`}>Coverage Check</Text>
//       </View>

//       {/* Check Service Availability */}
//       <View style={tw`bg-white rounded-xl p-4 border border-gray-200`}>
//         <View style={tw`flex-row items-center mb-3`}>
//           <Icon name="signal-cellular-alt" size={22} color="black" />
//           <Text style={tw`ml-2 font-semibold`}>
//             Check Service Availability
//           </Text>
//         </View>
//         <Text style={tw`text-xs text-gray-500 mb-4`}>
//           Enter a ZIP code or address to check if our services are available
//         </Text>

//         <TextInput
//           style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
//           placeholder="ZIP code (e.g., 12345) or full address"
//           value={zip}
//           onChangeText={setZip}
//         />

//         {/* Quick ZIPs */}
//         <View style={tw`flex-row flex-wrap mb-2`}>
//           {quickZips.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               style={tw`bg-gray-100 rounded-lg px-4 py-2 mr-2 mb-2`}
//               onPress={() => setZip(item)}
//             >
//               <Text style={tw`text-gray-700`}>{item}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <TouchableOpacity
//           style={tw`bg-black py-3 rounded-xl`}
//           onPress={handleCheck}
//         >
//           <Text style={tw`text-white text-center font-semibold`}>
//             Check Coverage
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Network Information */}
//       <View style={tw`bg-white rounded-xl p-4 mt-2 border border-gray-200`}>
//         <Text style={tw`font-semibold mb-4`}>Network Information</Text>

//         <View style={tw`flex-row items-center mb-3`}>
//           <View style={tw`bg-green-500 px-2 py-1 rounded`}>
//             <Text style={tw`text-white text-xs font-bold`}>5G</Text>
//           </View>
//           <Text style={tw`ml-3 text-gray-800`}>
//             Ultra-fast speeds up to 1 Gbps
//           </Text>
//         </View>

//         <View style={tw`flex-row items-center mb-3`}>
//           <View style={tw`bg-blue-500 px-2 py-1 rounded`}>
//             <Text style={tw`text-white text-xs font-bold`}>4G</Text>
//           </View>
//           <Text style={tw`ml-3 text-gray-800`}>
//             High-speed data up to 100 Mbps
//           </Text>
//         </View>

//         <View style={tw`flex-row items-center`}>
//           <View style={tw`bg-yellow-500 px-2 py-1 rounded`}>
//             <Text style={tw`text-white text-xs font-bold`}>3G</Text>
//           </View>
//           <Text style={tw`ml-3 text-gray-800`}>
//             Standard data speeds up to 21 Mbps
//           </Text>
//         </View>
//       </View>

//       {/* Coverage Check Tips */}
//       <View style={tw`bg-white rounded-xl p-4 mt-2 border border-gray-200`}>
//         <Text style={tw`font-semibold mb-3`}>Coverage Check Tips</Text>
//         <Text style={tw`text-xs text-gray-600 mb-2`}>
//           • Enter specific addresses for more accurate results.
//         </Text>
//         <Text style={tw`text-xs text-gray-600 mb-2`}>
//           • Coverage may vary inside buildings or underground.
//         </Text>
//         <Text style={tw`text-xs text-gray-600 mb-2`}>
//           • 5G coverage is expanding to more areas monthly.
//         </Text>
//         <Text style={tw`text-xs text-gray-600`}>
//           • Contact support for coverage improvement requests.
//         </Text>
//       </View>
//     </ScrollView>
//   );
// };

// export default CoverageCheck;
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import processQuery from '../utils/QueryProcessor';
import coverage from '../../assets/data/coverage.json';

const CoverageCheck = () => {
  const navigation = useNavigation();
  const [zip, setZip] = useState('');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const quickZips = coverage.map(c => c.zip);

  const handleCheck = async () => {
    if (!zip) {
      Alert.alert('Error', 'Please enter a ZIP code or address');
      return;
    }
    try {
      const result = await processQuery(`Check coverage at ${zip}`, 'coverageCheck');
      setResponse(result.message);
      if (!result.success) {
        Alert.alert('Query Error', result.message);
      }
    } catch (error) {
      console.error('Error processing coverage check:', error);
      Alert.alert('Error', 'Failed to process coverage check.');
    }
  };

  const handleQuery = async () => {
    if (!query) {
      Alert.alert('Error', 'Please enter a query.');
      return;
    }
    try {
      const result = await processQuery(query, 'coverageCheck');
      setResponse(result.message);
      if (!result.success) {
        Alert.alert('Query Error', result.message);
      }
    } catch (error) {
      console.error('Error processing query:', error);
      Alert.alert('Error', 'Failed to process query.');
    }
    setQuery('');
  };

  return (
    <LinearGradient
      colors={['#fde047', '#f472b6', '#9333ea']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={tw`flex-1`}
    >
      <View style={tw`flex-1 items-center justify-center px-4 pt-8`}>
        <View style={tw`bg-white rounded-2xl w-full p-6`}>
          <Text style={tw`text-lg font-bold text-center mb-1`}>Coverage Check</Text>
          <Text style={tw`text-gray-600 text-center mb-5 text-xs`}>
            Check if our services are available in your area
          </Text>

          <View style={tw`mb-4 border border-gray-300 rounded-lg p-3`}>
            <View style={tw`flex-row items-center mb-3`}>
              <Icon name="signal-cellular-alt" size={22} color="black" />
              <Text style={tw`ml-2 font-semibold`}>Check Service Availability</Text>
            </View>
            <Text style={tw`text-xs text-gray-500 mb-4`}>
              Enter a ZIP code or address, e.g., "Check coverage at 12345"
            </Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
              placeholder="ZIP code (e.g., 12345) or full address"
              value={zip}
              onChangeText={setZip}
            />
            <TextInput
              style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
              placeholder="e.g., Check coverage at 12345"
              value={query}
              onChangeText={setQuery}
            />
            <View style={tw`flex-row flex-wrap mb-2`}>
              {quickZips.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={tw`bg-gray-100 rounded-lg px-4 py-2 mr-2 mb-2`}
                  onPress={() => setZip(item)}
                >
                  <Text style={tw`text-gray-700`}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity 
              style={tw`bg-purple-600 py-3 rounded-xl mb-4`} 
              onPress={handleQuery}
            >
              <Text style={tw`text-white text-center font-semibold`}>Ask About Coverage</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={tw`bg-purple-600 py-3 rounded-xl`} 
              onPress={handleCheck}
            >
              <Text style={tw`text-white text-center font-semibold`}>Check Coverage</Text>
            </TouchableOpacity>
            {response && (
              <View style={tw`bg-gray-100 rounded-lg p-3 mt-4`}>
                <Text style={tw`text-sm text-gray-700`}>{response}</Text>
              </View>
            )}
          </View>

          <View style={tw`mb-4 border border-gray-300 rounded-lg p-3`}>
            <Text style={tw`font-semibold mb-4`}>Network Information</Text>
            <View style={tw`flex-row items-center mb-3`}>
              <View style={tw`bg-green-500 px-2 py-1 rounded`}>
                <Text style={tw`text-white text-xs font-bold`}>5G</Text>
              </View>
              <Text style={tw`ml-3 text-gray-800`}>Ultra-fast speeds up to 1 Gbps</Text>
            </View>
            <View style={tw`flex-row items-center mb-3`}>
              <View style={tw`bg-blue-500 px-2 py-1 rounded`}>
                <Text style={tw`text-white text-xs font-bold`}>4G</Text>
              </View>
              <Text style={tw`ml-3 text-gray-800`}>High-speed data up to 100 Mbps</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <View style={tw`bg-yellow-500 px-2 py-1 rounded`}>
                <Text style={tw`text-white text-xs font-bold`}>3G</Text>
              </View>
              <Text style={tw`ml-3 text-gray-800`}>Standard data speeds up to 21 Mbps</Text>
            </View>
          </View>

          <Text style={tw`text-gray-500 text-xs text-center mt-3`}>
            Coverage may vary; contact support for details
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default CoverageCheck;