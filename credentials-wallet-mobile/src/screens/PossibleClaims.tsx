import React, { useEffect, useState } from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@app/screens';
import ScreenContainer from '@app/components/ScreenContainer';
import BackButton from '@app/components/BackButton';
import {H2, RightView} from '@app/lib/styles/common';
import MenuButton from '@app/components/MenuButton';
import GoogleProvider from '@app/components/ProviderBody/GoogleProvider';
import GithubProvider from '@app/components/ProviderBody/GithubProvider';
import AmazonOrderHistoryProvider from '@app/components/ProviderBody/AmazonOrderHistoryProvider';
import { ProviderBodyProps, ProviderType } from '@app/providers';
import { useReduxSelector } from '@app/redux/config';
import { getGoogleInfo } from '@app/redux/google/selectors';

type Props = NativeStackScreenProps<RootStackParamList, 'PossibleClaims'>;

const PROVIDER_MAP: { [P in ProviderType]?: React.FC<ProviderBodyProps> } = {
  'google-login': GoogleProvider,
  'github-repo': GithubProvider,
  'amazon-order-history': AmazonOrderHistoryProvider
}

const PossibleClaims: React.FC<Props> = ({navigation, route}) => {
  const {provider} = route.params;
  const {email} = useReduxSelector(getGoogleInfo);

  const makeProvider = PROVIDER_MAP[provider]
  if(!makeProvider) {
    return (
      <>
        {provider} provider not supported
      </>
    )
  }

  return (
    <ScreenContainer
      navigation={navigation}
      title='Possible Claims'
      headerLeft={
        <BackButton onPress={() => navigation.goBack()} />
      }
      headerRight={
        <MenuButton onPress={() => {}} />
      }
    >
      {React.createElement(makeProvider, {
        provider,
        navigate: () => navigation.navigate('CreateLink'),
        value: email!
      })}
    </ScreenContainer>
  );
};

export default PossibleClaims;
