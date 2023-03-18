import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import YourLinks from './YourLinks';
import {Link} from '@app/redux/links/types';
import { Template } from '@app/redux/templates/types';

import ShareLink from './ShareLink';
import CreateLink from './CreateLink';
import CreateClaim from './CreateClaim';
import PossibleClaims from './PossibleClaims';
import GithubAuth from './GithubAuth';
import LinkScreen from './LinkScreen';
import TemplateScreen from './Template';
import LinkCreated from './LinkCreated';
import NotificationHome from './NotificationHome';
import SettingsScreen from './SettingsScreen';
import NotificationInfo from './NotificationInfo';
import VerifyClaims from './VerifyClaims';

export type RootStackParamList = {
  Home: undefined;
  YourLinks: undefined;
  CreateLink: undefined;
  ShareLink: { link: Link };
  CreateClaim: undefined;
  PossibleClaims: {provider: string};
  GithubAuth: undefined;
  LinkScreen: {link: string};
  Template: {template: Template};
  LinkCreated: {link: Link} | undefined;
  NotificationHome: undefined;
  Settings: undefined;
  NotificationInfo: {linkId: string; id: string};
  VerifyClaims: {id: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Links = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="YourLinks" component={YourLinks} />
      <Stack.Screen name="CreateLink" component={CreateLink} />
      <Stack.Screen name="ShareLink" component={ShareLink} />
      <Stack.Screen name="CreateClaim" component={CreateClaim} />
      <Stack.Screen name="PossibleClaims" component={PossibleClaims} />
      <Stack.Screen name="GithubAuth" component={GithubAuth} />
      <Stack.Screen name="LinkScreen" component={LinkScreen} />
      <Stack.Screen name="Template" component={TemplateScreen} />
      <Stack.Screen name="LinkCreated" component={LinkCreated} />
      <Stack.Screen name="NotificationHome" component={NotificationHome} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="NotificationInfo" component={NotificationInfo} />
      <Stack.Screen name="VerifyClaims" component={VerifyClaims} />
    </Stack.Navigator>
  );
};

export default Links;
