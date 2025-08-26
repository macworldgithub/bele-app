import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; 
import tw from 'tailwind-react-native-classnames';

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#FDE68A', '#F472B6', '#8B5CF6']} // yellow → pink → purple
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={tw`flex-1 items-center justify-center`}
    >
      {/* Logo */}
      <View style={tw`items-center`}>
        <Image
          source={require('../../assets/belle-logo.png')}
          style={[tw`mb-3`, { width: 112, height: 112 }]} // w-28 h-28
          resizeMode="contain"
        />
        <Text style={tw`text-black text-xl font-bold`}>Bele</Text>
      </View>
    </LinearGradient>
  );
};

export default Splash;
