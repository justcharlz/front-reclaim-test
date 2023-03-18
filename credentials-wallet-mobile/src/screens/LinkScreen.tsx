import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import { RootStackParamList } from '.';
import messages from '@app/lib/messages.json';
import {
  ContainerView,
  H3,
  H2,
  RightView,
  FlexRow,
  ClaimsContainer,
} from '@app/lib/styles/common';
import ScreenContainer from '@app/components/ScreenContainer';
import ActionButton from '@app/components/ActionButton';
import CancelButton from '@app/components/CancelButton';
import {privateIcon} from '../../public/private';
import {SvgXml} from 'react-native-svg';
import {CtaButton} from '@app/components/CtaButton';
import Footer from '@app/components/Footer';
import Card from '@app/components/Card';
import ClaimCardContent from '@app/components/ClaimCardContent';
import {useReduxDispatch, useReduxSelector} from '@app/redux/config';
import {
  getEphemeralPrivateKey,
  getEphemeralPublicKey,
  getUserPrivateKey,
} from '@app/redux/userWallet/selectors';
import {getClient} from '@app/lib/client';
import {generateEphemeralWallet} from '@app/redux/userWallet/actions';
import {Claim, ClaimStatus, Link} from '@app/redux/links/types';
import theme from '@app/lib/styles/theme';
import LoadingIcon from '@app/components/LoadingIcon';
import { getLinkDetails } from '@app/redux/link/selectors';
import { fetchLinkDetails } from '@app/redux/link/actions';

type Props = NativeStackScreenProps<RootStackParamList, 'LinkScreen'>;

const LinkScreen: React.FC<Props> = ({navigation, route}) => {
  const linkId = route.params.link;
  const dispatch = useReduxDispatch();
  const masterPrivateKey = useReduxSelector(getUserPrivateKey);
  const ephemeralPublicKey = useReduxSelector(getEphemeralPublicKey);

  const [status, setStatus] = React.useState<string>('Pending');

  const ePubKey = Buffer.from(ephemeralPublicKey, 'hex');

  const client = getClient(masterPrivateKey, true);

  const [link, setLink] = useState<Link>();

  useEffect(() => {
    dispatch(generateEphemeralWallet(false));
    if (linkId) {
      dispatch(fetchLinkDetails(linkId, setLink, masterPrivateKey))
    }
  }, [linkId, dispatch]);

  const handleRequestAccess = async () => {
    setStatus('requesting ...');

    await client.createVerificationReq({
      linkId: linkId,
      communicationPublicKey: ePubKey,
      context: '',
    });
    
    setStatus('Access requested');
  };


  return (
    <>
      {link !== undefined ? (
        <Footer
          height="30%"
          footer={
            <ContainerView>
              <SvgXml xml={privateIcon} />
              <H2>The link is private</H2>
              <H3>You must request access to view claims</H3>
              {status === 'Pending' ? (
                <CtaButton
                  onPress={() => handleRequestAccess()}
                  text="Request access"
                />
              ) : (
                <CtaButton
                  onPress={() => {}}
                  text={status}
                  backgroundColor={theme.palette.common.lightGray}
                  textColor={theme.palette.common.black}
                />
              )}
            </ContainerView>
          }>
          <ScreenContainer
            navigation={navigation}
            headerLeft={
              <CancelButton
                onPress={() => navigation.navigate('YourLinks')}
              />
            }
            headerRight={
              <ActionButton
                onPress={() => navigation.navigate('ShareLink', {link})}
                text={messages.common.edit}
              />
            }
            title={link.name}>
            <H3 color="black">{link.userId}</H3>

            {link.claims && (
              <H3>
                {link?.claims.length}{' '}
                {link.claims.length > 1 ? 'claims' : 'claim'} . Private
              </H3>
            )}
            <ClaimsContainer>
              {link &&
                link.claims.map((claim: Claim, index: number) => {
                  return (
                    <Card key={index}>
                      <ClaimCardContent
                        claim={{...claim, status: ClaimStatus.MINTED}}
                      />
                    </Card>
                  );
                })}
            </ClaimsContainer>
          </ScreenContainer>
        </Footer>
      ) : (
        <LoadingIcon/>
      )}
    </>
  );
};

export default LinkScreen;
