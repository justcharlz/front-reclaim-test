import React, {useRef, useCallback, useMemo} from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '.';
import messages from '@app/lib/messages.json';
import {
  ContainerView,
  H3,
  H2,
  RightView,
  FlexRow,
  FlexColumn,
  ClaimsContainer,
} from '@app/lib/styles/common';
import ScreenContainer from '@app/components/ScreenContainer';
import ActionButton from '@app/components/ActionButton';
import CancelButton from '@app/components/CancelButton';
import Footer from '@app/components/Footer';
import {RoundCtaButton} from '@app/components/CtaButton';
import {useReduxSelector} from '@app/redux/config';
import {getLastLink} from '@app/redux/links/selectors';
import {ScrollView} from 'react-native-gesture-handler';
import Card from '@app/components/Card';
import ClaimCardContent from '@app/components/ClaimCardContent';
import {Container} from '@app/components/RequestsView/styles';
import BottomSheetView from '@app/components/BottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import LinkView from '@app/components/LinkView';
import {BottomSheetBody} from './styles';
import {
  BottomSheetFooter,
  LinkContainer,
  LinkHeader,
} from '@app/components/BottomSheet/styles';
import {SvgXml} from 'react-native-svg';
import {securityLockIconXml} from '@app/assets/svgs';
import {BodyEmphasized} from '@app/lib/styles/common';
import {CtaButton} from '@app/components/CtaButton';
import theme from '@app/lib/styles/theme';
import Clipboard from '@react-native-clipboard/clipboard';

type Props = NativeStackScreenProps<RootStackParamList, 'LinkCreated'>;

const LinkCreated: React.FC<Props> = ({navigation, route}) => {
  let link = useReduxSelector(getLastLink);
  const routeLink = route.params?.link;
  if (routeLink !== undefined) {
    link = routeLink;
  }
  const [isOpenShareSheet, setIsOpenShareSheet] = React.useState(false);

  const copyToClipboard = () => {
    Clipboard.setString(`http://share.reclaimprotocol.org/link/${link.id}`);
  };

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPointsShare = useMemo(() => ['25%', '42%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <>
      <Footer
        height="7%"
        footer={
          <Container>
            <FlexRow>
              <FlexColumn>
                <H3 color="black" weight="700">
                  Only you
                </H3>
                <H3>Share to give others access</H3>
              </FlexColumn>
              <RightView></RightView>
              <RoundCtaButton
                onPress={() => setIsOpenShareSheet(true)}
                text={messages.common.share}
                width="20%"
              />
            </FlexRow>
          </Container>
        }>
        <ScreenContainer
          navigation={navigation}
          headerLeft={
              <CancelButton onPress={() => navigation.navigate('YourLinks')} />
          }
          headerRight={
            <ActionButton
              onPress={() => console.log('here we got to edit page')}
              text={messages.common.edit}
            />
          }
          title={link.name}>
          <H3 color="black" weight="700">
            {link.userId}
          </H3>
          <H3>
            {link.claims.length} {link.claims.length > 1 ? 'claims' : 'claim'} .
            Private
          </H3>
          <ClaimsContainer>
            {link &&
              link.claims.map((claim, index) => {
                return (
                  <Card key={index}>
                    <ClaimCardContent claim={claim} />
                  </Card>
                );
              })}
          </ClaimsContainer>
        </ScreenContainer>
      </Footer>
      {isOpenShareSheet && (
        <BottomSheetView
          title="Share"
          bottomSheetRef={bottomSheetRef}
          snapPoints={snapPointsShare}
          onChange={handleSheetChanges}
          setOpenSheet={setIsOpenShareSheet}>
          <LinkView linkTitle={link.name} owner={'owner'} />
          <BottomSheetBody>
            <LinkContainer>
              <SvgXml xml={securityLockIconXml} />
              <LinkHeader>
                <BodyEmphasized>Only be visible to you</BodyEmphasized>
                <H3>
                  Links are encrypted by default. To allow others to view it,
                  they need to send a request.
                </H3>
              </LinkHeader>
            </LinkContainer>
          </BottomSheetBody>
          <BottomSheetFooter>
            <CtaButton
              text={messages.editLink.copyUrl}
              onPress={copyToClipboard}
              width="48%"
            />
            <CtaButton
              text={messages.editLink.moreOptions}
              onPress={() => {}}
              width="48%"
              backgroundColor={theme.palette.common.lightGray}
              textColor={theme.palette.common.black}
            />
          </BottomSheetFooter>
        </BottomSheetView>
      )}
    </>
  );
};

export default LinkCreated;
