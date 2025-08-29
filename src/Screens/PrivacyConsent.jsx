// import React, { useState } from "react";
// import { View, Text, ScrollView, TouchableOpacity } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import tw from "tailwind-react-native-classnames";

// const PrivacyConsent = () => {
//   const [gdprChecked, setGdprChecked] = useState(false);
//   const [ccpaChecked, setCcpaChecked] = useState(false);

//   return (
//     <LinearGradient
//       colors={["#fde047", "#f472b6", "#9333ea"]} // yellow → pink → purple
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={tw`flex-1`}
//     >
//       {/* Main Card */}
//       <View style={tw`flex-1 items-center justify-center px-4`}>
//         <View style={tw`bg-white rounded-2xl w-full p-6`}>
//           {/* Title */}
//           <Text style={tw`text-lg font-bold text-center mb-1`}>
//             Privacy & Consent
//           </Text>
//           <Text style={tw`text-gray-600 text-center mb-5 text-xs`}>
//             Please review and accept our data protection policies
//           </Text>

//           {/* GDPR Section */}
//           <View style={tw`mb-4 border border-gray-300 rounded-lg p-3 text-xs`}>
//             <Text style={tw`font-semibold mb-2`}>GDPR Data Protection</Text>
//             <View style={tw`border border-gray-300 rounded-md h-20 p-2 mb-2 bg-gray-50`}>
//               <ScrollView>
//                 <Text style={tw`text-sm text-gray-700`}>
//                   <Text style={tw`font-semibold`}>
//                     General Data Protection Regulation (GDPR) Consent:
//                   </Text>{" "}
//                   We collect and process your personal data including account
//                   information, billing details, and service usage data to
//                   provide utility services. This includes name, address, contact
//                   information, and payment details.
//                 </Text>
//               </ScrollView>
//             </View>
//             <TouchableOpacity
//               onPress={() => setGdprChecked(!gdprChecked)}
//               style={tw`flex-row items-center`}
//             >
//               <View
//                 style={[
//                   tw`w-5 h-5 mr-2 border rounded`,
//                   gdprChecked
//                     ? tw`bg-purple-600 border-purple-600`
//                     : tw`border-gray-400`,
//                 ]}
//               />
//               <Text style={tw`text-gray-700 text-sm`}>
//                 I consent to the processing of my personal data under GDPR
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* CCPA Section */}
//           <View style={tw`mb-4 border border-gray-300 rounded-lg p-3`}>
//             <Text style={tw`font-semibold mb-2`}>CCPA Privacy Rights</Text>
//             <View style={tw`border border-gray-300 rounded-md h-20 p-2 mb-2 bg-gray-50`}>
//               <ScrollView>
//                 <Text style={tw`text-sm text-gray-700`}>
//                   <Text style={tw`font-semibold`}>
//                     California Consumer Privacy Act (CCPA) Notice:
//                   </Text>{" "}
//                   We may share your information with service partners for
//                   billing, maintenance, and customer support. We do not sell
//                   personal information. Your California Rights: Right to know
//                   what personal information we collect.
//                 </Text>
//               </ScrollView>
//             </View>
//             <TouchableOpacity
//               onPress={() => setCcpaChecked(!ccpaChecked)}
//               style={tw`flex-row items-center`}
//             >
//               <View
//                 style={[
//                   tw`w-5 h-5 mr-2 border rounded`,
//                   ccpaChecked
//                     ? tw`bg-purple-600 border-purple-600`
//                     : tw`border-gray-400`,
//                 ]}
//               />
//               <Text style={tw`text-gray-700 text-sm`}>
//                 I acknowledge my rights under CCPA and consent to data
//                 processing
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Buttons */}
//           <View style={tw`flex-row justify-between mt-2`}>
//             <TouchableOpacity
//               style={tw`flex-1 mr-2 border border-purple-600 rounded-xl py-3`}
//             >
//               <Text style={tw`text-center font-semibold text-purple-600`}>
//                 Decline
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={tw`flex-1 ml-2 bg-purple-600 rounded-xl py-3`}
//               disabled={!gdprChecked || !ccpaChecked}
//             >
//               <Text style={tw`text-center font-semibold text-white`}>
//                 Accept & Continue
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Footer */}
//           <Text style={tw`text-gray-500 text-xs text-center mt-3`}>
//             Your consent preferences are stored securely and can be updated in
//             account settings
//           </Text>
//         </View>
//       </View>
//     </LinearGradient>
//   );
// };

// export default PrivacyConsent;

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'tailwind-react-native-classnames';
import { useNavigation, useRoute } from '@react-navigation/native';

const PrivacyConsent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params || {};
  const [gdprChecked, setGdprChecked] = useState(false);
  const [ccpaChecked, setCcpaChecked] = useState(false);

  return (
    <LinearGradient
      colors={['#fde047', '#f472b6', '#9333ea']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={tw`flex-1`}
    >
      <View style={tw`flex-1 items-center justify-center px-4`}>
        <View style={tw`bg-white rounded-2xl w-full p-6`}>
          <Text style={tw`text-lg font-bold text-center mb-1`}>Privacy & Consent</Text>
          <Text style={tw`text-gray-600 text-center mb-5 text-xs`}>
            Please review and accept our data protection policies
          </Text>

          <View style={tw`mb-4 border border-gray-300 rounded-lg p-3 text-xs`}>
            <Text style={tw`font-semibold mb-2`}>GDPR Data Protection</Text>
            <View style={tw`border border-gray-300 rounded-md h-20 p-2 mb-2 bg-gray-50`}>
              <ScrollView>
                <Text style={tw`text-sm text-gray-700`}>
                  <Text style={tw`font-semibold`}>General Data Protection Regulation (GDPR) Consent:</Text>{' '}
                  We collect and process your personal data including account information, billing details, and service usage data to provide utility services.
                </Text>
              </ScrollView>
            </View>
            <TouchableOpacity
              onPress={() => setGdprChecked(!gdprChecked)}
              style={tw`flex-row items-center`}
            >
              <View
                style={[
                  tw`w-5 h-5 mr-2 border rounded`,
                  gdprChecked ? tw`bg-purple-600 border-purple-600` : tw`border-gray-400`,
                ]}
              />
              <Text style={tw`text-gray-700 text-sm`}>I consent to GDPR data processing</Text>
            </TouchableOpacity>
          </View>

          <View style={tw`mb-4 border border-gray-300 rounded-lg p-3`}>
            <Text style={tw`font-semibold mb-2`}>CCPA Privacy Rights</Text>
            <View style={tw`border border-gray-300 rounded-md h-20 p-2 mb-2 bg-gray-50`}>
              <ScrollView>
                <Text style={tw`text-sm text-gray-700`}>
                  <Text style={tw`font-semibold`}>California Consumer Privacy Act (CCPA) Notice:</Text>{' '}
                  We may share your information with service partners for billing and support. We do not sell personal information.
                </Text>
              </ScrollView>
            </View>
            <TouchableOpacity
              onPress={() => setCcpaChecked(!ccpaChecked)}
              style={tw`flex-row items-center`}
            >
              <View
                style={[
                  tw`w-5 h-5 mr-2 border rounded`,
                  ccpaChecked ? tw`bg-purple-600 border-purple-600` : tw`border-gray-400`,
                ]}
              />
              <Text style={tw`text-gray-700 text-sm`}>I acknowledge my CCPA rights</Text>
            </TouchableOpacity>
          </View>

          <View style={tw`flex-row justify-between mt-2`}>
            <TouchableOpacity 
              style={tw`flex-1 mr-2 border border-purple-600 rounded-xl py-3`}
              onPress={() => navigation.replace('Login')}
            >
              <Text style={tw`text-center font-semibold text-purple-600`}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                tw`flex-1 ml-2 rounded-xl py-3`,
                gdprChecked && ccpaChecked ? tw`bg-purple-600` : tw`bg-gray-400`,
              ]}
              disabled={!gdprChecked || !ccpaChecked}
              onPress={() => navigation.replace('Home', { userId })}
            >
              <Text style={tw`text-center font-semibold text-white`}>Accept & Continue</Text>
            </TouchableOpacity>
          </View>

          <Text style={tw`text-gray-500 text-xs text-center mt-3`}>
            Your consent preferences are stored securely
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default PrivacyConsent;