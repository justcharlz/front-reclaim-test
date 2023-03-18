import React, {useCallback, useMemo, useRef} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@app/screens';
import Card from '@app/components/Card';
import messages from '@app/lib/messages.json';
import {
  BodyEmphasized,
  BodyView,
  H3,
  MetaActionBar,
  H2,
} from '@app/lib/styles/common';
import ScreenContainer from '@app/components/ScreenContainer';
import ActionButton from '@app/components/ActionButton';
import {CtaButton} from '@app/components/CtaButton';
import ClaimCardContent from '@app/components/ClaimCardContent';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetView from '@app/components/BottomSheet';
import {securityLockIconXml} from '@app/assets/svgs';
import {
  BottomSheetFooter,
  LinkContainer,
  LinkHeader,
} from '@app/components/BottomSheet/styles';
import LinkView from '@app/components/LinkView';
import theme from '@app/lib/styles/theme';
import {SvgXml} from 'react-native-svg';
import {BottomSheetBody} from './styles';
import CancelButton from '@app/components/CancelButton';

type Props = NativeStackScreenProps<RootStackParamList, 'ShareLink'>;

const ShareLink: React.FC<Props> = ({navigation, route}) => {
  const claims = route.params.link.claims;

  const [isOpenShareSheet, setIsOpenShareSheet] = React.useState(false);
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleSharePress = () => {
    setIsOpenShareSheet(true);
  };

  return (
    <ScreenContainer
      navigation={navigation}
      headerLeft={
        <CancelButton
          onPress={() => {
            navigation.navigate('YourLinks');
          }}
        />
      }
      headerRight={
        <ActionButton
          onPress={() => navigation.navigate('CreateLink')}
          text={messages.common.edit}
        />
      }
      title={route.params.link.name}>
      <BodyView>
        <BodyEmphasized>{route.params.link.userId}</BodyEmphasized>
        <H3>
          {claims.length} {claims.length > 1 ? 'claims' : 'claim'} . Private
        </H3>
        <CtaButton onPress={handleSharePress} text="Share" />
        {claims &&
          claims.map((claim, index) => (
            <Card key={index}>
              <ClaimCardContent key={index} claim={claim} />
            </Card>
          ))}
      </BodyView>
      {isOpenShareSheet && (
        <BottomSheetView
          title="Share"
          bottomSheetRef={bottomSheetRef}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          setOpenSheet={setIsOpenShareSheet}>
          <LinkView linkTitle={route.params.link.name} owner={'owner'} />
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
              onPress={() => {}}
              width="50%"
            />
            <CtaButton
              text={messages.editLink.moreOptions}
              onPress={() => {}}
              width="50%"
              backgroundColor={theme.palette.common.lightGray}
              textColor={theme.palette.common.black}
            />
          </BottomSheetFooter>
        </BottomSheetView>
      )}
    </ScreenContainer>
  );
};

export default ShareLink;
