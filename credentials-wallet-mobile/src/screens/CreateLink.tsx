import React, { useState } from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@app/screens';
import ScreenContainer from '@app/components/ScreenContainer';
import {
  BodyEmphasized,
  FlexColumn,
  H3,
  makeMarginTopComponent,
  MetaActionBar,
  ScreenTitle,
  TextInput,
} from '@app/lib/styles/common';
import messages from '@app/lib/messages.json';
import CancelButton from '@app/components/CancelButton';
import AddClaimCard from '@app/components/AddClaimCard';
import {useReduxDispatch, useReduxSelector} from '@app/redux/config';
import {getTempLink, isAllClaimsMintedInTempLink, isTempLinkReadyForSubmit} from '@app/redux/links/selectors';
import ClaimCardContent from '@app/components/ClaimCardContent';
import Card from '@app/components/Card';
import MenuButton from '@app/components/MenuButton';
import theme from '@app/lib/styles/theme';
import { GrayH3 } from '@app/components/LinkCardContent/styles';
import { RoundCtaButton } from '@app/components/CtaButton';
import { ScrollView } from 'react-native-gesture-handler';
import { getUserPrivateKey } from '@app/redux/userWallet/selectors';
import { submitTempLink } from '@app/redux/links/actions';
import { isAppLoading } from '@app/redux/selectors';
import { setTempLink } from '@app/redux/links';
import { debounce } from 'lodash';
import LoadingIcon from '@app/components/LoadingIcon';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateLink'>;

const MarginTop = makeMarginTopComponent(0);
const MarginBottom = makeMarginTopComponent(0);

const CreateLink: React.FC<Props> = ({navigation}) => {
  const link = useReduxSelector(getTempLink);
  const readyToSubmit = useReduxSelector(isTempLinkReadyForSubmit);
  const [name, setName] = useState<string>('');
  const dispatch = useReduxDispatch();
  const loading = useReduxSelector(isAppLoading);

  const handleAddPress = React.useCallback(() => {
    navigation.navigate('CreateClaim');
  }, [navigation]);

  const updateTempLink = debounce((name: string) => {
    dispatch(setTempLink({
      ...link,
      name
    }));
  }, 1);

  const handleAddLink = React.useCallback(async () => {
    await dispatch(submitTempLink({}));
    navigation.navigate('LinkCreated');  
  }, [dispatch, navigation, link]);

  if (loading) return <LoadingIcon />;
  return (
    <ScreenContainer
      navigation={navigation}
      headerLeft={
        <CancelButton onPress={() => navigation.navigate('YourLinks')} />
      }
      headerMiddle={
        <ScreenTitle>{messages.createLink.title}</ScreenTitle>
      }
      headerRight={
        <MenuButton onPress={() => {}} />
      }
      footer={
        <>
          <MetaActionBar>
            <FlexColumn>
              <BodyEmphasized>
                {link.claims.length === 0
                  ? 'None selected'
                  : `${link.claims.length} selected`}
              </BodyEmphasized>
            </FlexColumn>
            {!readyToSubmit ? (
              <RoundCtaButton
                text="Create"
                textColor={theme.palette.common.darkGray}
                backgroundColor={theme.palette.common.lightGray}
                width="83px"
                onPress={() => {}}
              />
            ) : (
              <RoundCtaButton
                text="Create"
                textColor={theme.palette.common.white}
                backgroundColor={theme.palette.common.blue}
                width="83px"
                onPress={handleAddLink}
              />
            )}
          </MetaActionBar>
          <MarginBottom />
        </>
      }>
      <TextInput
        placeholder="Untitled"
        placeholderTextColor={theme.palette.placeholderTextColor}
        value={name}
        onChangeText={name => { updateTempLink(name); setName(name); }}
      />
      <H3 color="black" weight="700">
        {link.userId}
      </H3>
      <GrayH3>
        {link.claims.length === 0
          ? 'No claims yet . Draft'
          : link.claims.length > 1
          ? link.claims.length + ' claims'
          : link.claims.length + ' claim'}
      </GrayH3>
      <MarginTop />
      <AddClaimCard handleAddPress={handleAddPress} />
      <ScrollView>
        {link.claims &&
          link.claims.map((claim, index) => {
            return (
              <Card key={index}>
                <ClaimCardContent claim={claim} />
              </Card>
            );
          })}
      </ScrollView>
    </ScreenContainer>
  );
};

export default CreateLink;
