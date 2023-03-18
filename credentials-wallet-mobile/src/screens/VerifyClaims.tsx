import React, { useRef, useCallback, useMemo } from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import { RootStackParamList } from '@app/screens';
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
import { RoundCtaButton } from '@app/components/CtaButton';
import { useReduxDispatch, useReduxSelector } from '@app/redux/config';
import { getLastLink } from '@app/redux/links/selectors';
import { ScrollView } from 'react-native-gesture-handler';
import Card from '@app/components/Card';
import ClaimCardContent from '@app/components/ClaimCardContent';
import { Container } from '@app/components/RequestsView/styles';
import BottomSheetView from '@app/components/BottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import LinkView from '@app/components/LinkView';
import { BottomSheetBody } from './styles';
import {
  BottomSheetFooter,
  LinkContainer,
  LinkHeader,
} from '@app/components/BottomSheet/styles';
import { SvgXml } from 'react-native-svg';
import { securityLockIconXml } from '@app/assets/svgs';
import { BodyEmphasized } from '@app/lib/styles/common';
import { CtaButton } from '@app/components/CtaButton';
import theme from '@app/lib/styles/theme';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  getUserPrivateKey,
  getUserPublicKey,
} from '@app/redux/userWallet/selectors';
import { getClient } from '@app/lib/client';
import { Claim, ClaimStatus, Link } from '@app/redux/links/types';
import { verifyEncryptedClaims } from '@questbook/reclaim-crypto-sdk';
import { utils, Wallet } from 'ethers';
import { decryptData } from '@questbook/reclaim-crypto-sdk';
import {
  getEphemeralPrivateKey,
  getEphemeralPublicKey,
} from '@app/redux/userWallet/selectors';
import LoadingIcon from '@app/components/LoadingIcon';
import { GetVerificationRequestsResponse, VerificationRequestStatus } from '@questbook/reclaim-client-sdk';

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyClaims'>;

const VerifyClaims: React.FC<Props> = ({ navigation, route }) => {
  const masterPrivateKey = useReduxSelector(getUserPrivateKey);
  // const publicKey = useReduxSelector(getUserPublicKey);

  const ephemeralPublicKey = useReduxSelector(getEphemeralPublicKey);
  const ephemeralPrivateKey = useReduxSelector(getEphemeralPrivateKey);

  const verificationReqId = route.params.id;
  const [isOpenShareSheet, setIsOpenShareSheet] = React.useState(false);
  const [request, setRequest] = React.useState<GetVerificationRequestsResponse['requests'][0]>();
  const [tempLink, setTempLink] = React.useState<Link>();
  const [link, setLink] = React.useState<Link>();
  const [loading, setLoading] = React.useState<boolean>(true);

  const client = getClient(masterPrivateKey);

  const copyToClipboard = () => {
    Clipboard.setString(`http://share.reclaimprotocol.org/link/${link?.id}`);
  };

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPointsShare = useMemo(() => ['25%', '42%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
  }, []);

  const getVerificationRequestDetails = async () => {
    if (verificationReqId) {
      const response = await client.getVerificationReq(
        {
          id: verificationReqId,
          pagination: {
            page: 1,
            pageSize: 10
          }
        }
      );

      const link = response.requests[0].link!;

      const formattedLink: Link = {
          ...link,
          claims: link.claims.map(claim => {
              return {
                  ...claim,
                  ownerPublicKey: Buffer.from(claim.ownerPublicKey).toString('hex'),
                  internalId: 0,
                  status: ClaimStatus.MINTED,
                  title: ''
              }
          })
      }

      setRequest(response.requests[0]);
      setTempLink(formattedLink);
    }
  };

  const verifyClaims = useCallback(async () => {
    const privateKey = utils.arrayify(ephemeralPrivateKey);
    if(tempLink === null || !tempLink?.id ) return;
    const claims = tempLink?.claims.map((claim: Claim) => {
      return {
        id: claim.id,
        provider: claim.provider as string,
        redactedParameters: claim.redactedParameters,
        ownerPublicKey: Buffer.from(claim.ownerPublicKey, 'hex'),
        timestampS: claim.timestampS,
        witnessAddresses: claim.witnessAddresses,
      };
    });

    const proofs = request?.encryptedClaimProofs.map((curRequest: any) => {
      return {
        enc: Buffer.from(curRequest.enc, 'base64'),
        id: curRequest.id,
      };
    });

    const response = verifyEncryptedClaims(claims!, proofs!, privateKey);
    const revealedClaims = tempLink?.claims.map((claim: Claim) => {
      return {
        ...claim,
        params: 
          response[claim.id].parameters,
      };
    });
    setLink({ ...tempLink, claims: revealedClaims! });
    setLoading(false);
  }, [tempLink, request]);

  React.useEffect(() => {
    getVerificationRequestDetails();
  }, [verificationReqId]);

  React.useEffect(() => {
    if (tempLink !== null) {
      if (request?.status == VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_REJECTED) {
        setLink(tempLink);
        setLoading(false);
      } else {
        verifyClaims();
      }
    }
  }, [tempLink, request]);

  return (
    <>
      {link !== null && link !== undefined && !loading ? (
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
              headerLeft={
                <CancelButton
                  onPress={() => navigation.navigate('NotificationHome')}
                />
              }
              headerRight={
                <ActionButton
                  onPress={() => verifyClaims()}
                  text={messages.common.edit}
                />
              }
              title={link.name}>
              <H3 color="black" weight="700">
                {link.userId}
              </H3>
              <H3>
                {link.claims.length}{' '}
                {link.claims.length > 1 ? 'claims' : 'claim'} . Private
              </H3>
              <ClaimsContainer>
                {link &&
                  link.claims.map((claim: Claim, index: number) => {
                    return (
                      <Card key={index}>
                        <ClaimCardContent
                          claim={{
                            ...claim,
                            status: ClaimStatus.MINTED,
                            timestampS: claim.timestampS,
                            witnessAddresses: claim.witnessAddresses,
                            redactedParameters: claim.redactedParameters,
                          }}
                        />
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
                      Links are encrypted by default. To allow others to view
                      it, they need to send a request.
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
                  onPress={() => { }}
                  width="48%"
                  backgroundColor={theme.palette.common.lightGray}
                  textColor={theme.palette.common.black}
                />
              </BottomSheetFooter>
            </BottomSheetView>
          )}
        </>
      ) : (
        <LoadingIcon />
      )}
    </>
  );
};

export default VerifyClaims;
