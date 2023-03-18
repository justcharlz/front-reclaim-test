import React, { useEffect, useState } from 'react';
import { Image, View, Text } from 'react-native';
import theme from '@app/lib/styles/theme';
import {
  Bold,
  FlexRow,
  H2,
  H3,
  makeMarginLeftComponent,
  makeMarginTopComponent,
  RightView,
} from '@app/lib/styles/common';
import messages from '@app/lib/messages.json';
import Card from '@app/components/Card';
import { CtaButton } from '@app/components/CtaButton';
import { useReduxDispatch, useReduxSelector } from '@app/redux/config';
import { getTempLink } from '@app/redux/links/selectors';
import { setTempLink, updateLink } from '@app/redux/links';
import { Claim, ClaimStatus } from '@app/redux/links/types';
import {
  getEphemeralPrivateKey,
  getEphemeralPublicKey,
  getUserPrivateKey,
  getUserPublicKey,
} from '@app/redux/userWallet/selectors';
import { GetServiceMetadataResponse } from '@questbook/reclaim-client-sdk/src/exploration/proto/api';
import { getClient, getNewClientInstance } from '@app/lib/client';
import { getWalletFromPrivateKey } from '@app/lib/utils/crypto';
import { createClaim } from '@questbook/reclaim-node';
import { getGoogleInfo } from '@app/redux/google/selectors';
import { createChannel, createClient } from 'nice-grpc-web';
import { ReclaimWitnessDefinition } from '@questbook/reclaim-node/lib/proto/api';
import { ProviderType } from '@app/providers';
import { CommonTransport } from '@questbook/common-grpc-web-transport';
import { Socket } from 'net';
import { TLSSocket } from 'tls';
import { addMintedClaim } from '@app/redux/mintedClaims';
import { createRedactedString } from '@app/lib/utils/helpers';
import PossibleClaimCard from '../PossibleClaimCard';

interface Props {
  value: string;
  provider: ProviderType;
  navigate: () => void;
}

const MarginLeft = makeMarginLeftComponent(0);
const MarginTop = makeMarginTopComponent(1);

const GoogleProvider: React.FC<Props> = ({
  value: email,
  provider,
  navigate,
}) => {
  const link = useReduxSelector(getTempLink);
  const dispatch = useReduxDispatch();
  const publicKey = useReduxSelector(getUserPublicKey);
  const privateKey = useReduxSelector(getUserPrivateKey);

  const ephemeralPublicKey = useReduxSelector(getEphemeralPublicKey);
  const ephemeralPrivateKey = useReduxSelector(getEphemeralPrivateKey);

  const googleState = useReduxSelector(getGoogleInfo);

  const [requestorWalletAddress, setRequestorWalletAddress] = useState('');

  const client = getClient(privateKey);

  const getRequestor = async () => {
    const requestor: GetServiceMetadataResponse = await client.getServiceMetadata();
    setRequestorWalletAddress(requestor.walletAddress);
  };

  const handleCreateClaim = React.useCallback(
    async () => {
      {
        const claimData = { parameters: `{"emailAddress":"${email}"}` };
        const paramObj = JSON.parse(claimData.parameters);
        const paramKey = Object.keys(paramObj)[0];
        const ephemeralWallet = getWalletFromPrivateKey(ephemeralPrivateKey);
        const claim: Claim = {
          internalId: link.claims.length,
          title: 'untitled',
          id: 0,
          chainId: 5,
          provider: 'google-login',
          params: JSON.parse(claimData.parameters),
          signatures: [],
          timestampS: Math.floor(Date.now() / 1000),
          witnessAddresses: [],
          ownerPublicKey: ephemeralPublicKey,
          status: ClaimStatus.PENDING,
          redactedParameters: createRedactedString(paramObj[paramKey]),
        };
        const updatedTempLink = {
          ...link,
          claims: [...link.claims, claim],
        };
        dispatch(setTempLink(updatedTempLink));
        navigate();

        const backendClient = getNewClientInstance(ephemeralPrivateKey);
        const response = await createClaim({
          name: 'google-login',
          params: JSON.parse(claimData.parameters),
          secretParams: { token: googleState.accessToken! },
          makeGrpcClient: grpcUrl => {
            const channel = createChannel(
              grpcUrl,
              CommonTransport({
                makeSocket: () => new Socket(),
                makeTLSSocket: socket => new TLSSocket(socket),
              }),
            );
            const client = createClient(ReclaimWitnessDefinition, channel);
            return client;
          },
          requestCreate: async infoHash => {
            const result = await backendClient.startClaimCreation(
              ephemeralWallet,
              requestorWalletAddress,
              infoHash,
            );
            return result;
          },
        });
        if (response) {
          const claimData = response.claimData;
          const paramObj = JSON.parse(claimData.parameters);
          const paramKey = Object.keys(paramObj)[0];
          const claim: Claim = {
            internalId: link.claims.length,
            title: 'untitled',
            id: claimData.claimId,
            chainId: response.chainId,
            provider: claimData.provider as ProviderType,
            params: JSON.parse(claimData.parameters),
            signatures: response.signatures,
            timestampS: claimData.timestampS,
            witnessAddresses: response.witnessHosts,
            ownerPublicKey: ephemeralPublicKey,
            status: ClaimStatus.MINTED,
            redactedParameters: createRedactedString(paramObj[paramKey]),
          };
          const updatedTempLink = {
            ...link,
            claims: [...link.claims, claim],
          };
          dispatch(setTempLink(updatedTempLink));
          dispatch(addMintedClaim(claim));
        }
      }
    }, [requestorWalletAddress]
  )


  useEffect(() => {
    if (requestorWalletAddress !== '') return;
    getRequestor();
  }, [requestorWalletAddress]);

  return (
    <>
      <FlexRow>
        <Image source={require('@app/assets/google.png')} />
        <MarginLeft />
        <View>
          <H2>{messages.common.google}</H2>
          <H3 color={theme.palette.common.black}>
            {messages.possibleClaims.signedInAs}
            <Bold>{` ${email}`}</Bold>
          </H3>
        </View>
      </FlexRow>
      <MarginTop />
      <PossibleClaimCard
        provider={provider}
        claim={'ownsEmail'}
        username={email}
        onPress={handleCreateClaim}
      />
      {/* <Card>
            <H3 color={theme.palette.common.black}>
                <Bold>
                    Owns email address
                </Bold>
            </H3>  
            <MarginTop/>
            <CtaButton 
                onPress={handleCreateClaim} 
                backgroundColor={theme.palette.common.lightGray} 
                text={"Create Claim"}
                textColor={theme.palette.common.black}
            />
        </Card> */}
    </>
  );
};

export default GoogleProvider;
