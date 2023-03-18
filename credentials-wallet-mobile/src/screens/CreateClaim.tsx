import React from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@app/screens';
import ScreenContainer from '@app/components/ScreenContainer';
import BackButton from '@app/components/BackButton';
import messages from '@app/lib/messages.json';
import {GrayH3} from '@app/components/LinkCardContent/styles';
import {Image, Text} from 'react-native';
import {
  FlexRow,
  makeMarginTopComponent,
  RightView,
  H2,
  H3,
  FlexColumn,
} from '@app/lib/styles/common';
import NextButton from '@app/components/NextButton';
import {useReduxDispatch, useReduxSelector} from '@app/redux/config';
import {fetchGoogleInfo} from '@app/redux/google/actions';
import { PROVIDERS } from '@app/providers';
import LoadingIcon from '@app/components/LoadingIcon';
import { isAppLoading } from '@app/redux/selectors';
import { getGoogleInfo } from '@app/redux/google/selectors';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateClaim'>;

const Margin = makeMarginTopComponent(2);

const CreateClaim: React.FC<Props> = ({navigation}) => {
  const dispatch = useReduxDispatch();
  const isLoading = useReduxSelector(isAppLoading);

  if(isLoading) return <LoadingIcon/>
  return (
    <ScreenContainer
      navigation={navigation}
      headerLeft={
        <>
          <BackButton onPress={() => navigation.goBack()} />
        </>
      }
      title={messages.createClaim.title}>
      <GrayH3>{messages.createClaim.description}</GrayH3>
      <Margin />
      <FlexColumn gap='20px'>
        {
          PROVIDERS.map(provider => {
            return (
              <FlexRow key={provider.provider}>
                <Image source={provider.iconPath} />
                <H2>{'  '} {provider.name}</H2>
                <RightView>
                  <NextButton
                    onPress={async () => {
                      await dispatch(fetchGoogleInfo())
                      navigateToPossibleClaims()
                    }}
                  />
                </RightView>
              </FlexRow>
            )

            function navigateToPossibleClaims() {
              navigation.navigate('PossibleClaims', { provider: provider.provider })
            }
          })
        }
      </FlexColumn>
    </ScreenContainer>
  );
};

export default CreateClaim;
