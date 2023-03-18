import React from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from 'react-native';
import { RootStackParamList } from '@app/screens';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreen: React.FC<Props> = ({navigation, route}) => {
  return <Text>Settings Page</Text>;
};

export default SettingsScreen;
