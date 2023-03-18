import React, {useEffect,} from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import { RootStackParamList } from '@app/screens';
import messages from '@app/lib/messages.json';
import {H3, H2, RightView, RequestButton} from '@app/lib/styles/common';
import ScreenContainer from '@app/components/ScreenContainer';
import ActionButton from '@app/components/ActionButton';
import CancelButton from '@app/components/CancelButton';
import Footer from '@app/components/Footer';
import Card from '@app/components/Card';
import RequestsView from '@app/components/RequestsView';
import {getClient} from '@app/lib/client';
import {useReduxSelector} from '@app/redux/config';
import {getUserPrivateKey} from '@app/redux/userWallet/selectors';
import {Claim} from '@app/redux/links/types';
import {ClaimStatus} from '@app/redux/links/types';
import {getLinkById} from '@app/redux/links/selectors';
import ClaimCardContent from '@app/components/ClaimCardContent';
import {ScrollView} from 'react-native-gesture-handler';
import { GetVerificationRequestsResponse } from '@questbook/reclaim-client-sdk';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'NotificationInfo'
>;

const NotificationInfo: React.FC<Props> = ({navigation, route}) => {
  const masterPrivateKey = useReduxSelector(getUserPrivateKey);
  const [isOpenRequestSheet, setIsOpenRequestSheet] = React.useState(false);
  const [request, setRequest] = React.useState<GetVerificationRequestsResponse['requests'][0]>();

  const linkId = route.params.linkId;
  const verificationReqId = route.params.id;
  const client = getClient(masterPrivateKey);

  const link = useReduxSelector(getLinkById(linkId));

  const getVerificationRequestDetails = async () => {
    if (verificationReqId) {
      const verificationRequest = await client.getVerificationReq(
       {
        id: verificationReqId,
        pagination:{
          page: 1,
          pageSize: 10
      }
      }
      );
      setRequest(verificationRequest.requests[0]);
    }
  };

  useEffect(() => {
    getVerificationRequestDetails();
  }, [verificationReqId]);

  return (
    <>
      {link !== null && link !== undefined ? (
        <Footer
          height={isOpenRequestSheet ? '40%' : '5%'}
          footer={
            isOpenRequestSheet ? (
              <RequestsView
                setIsOpenRequestSheet={setIsOpenRequestSheet}
                request={request!}
              />
            ) : (
              <RequestButton
                onPress={() => {
                  setIsOpenRequestSheet(true);
                }}>
                <H2>{'  '}Requests</H2>
              </RequestButton>
            )
          }>
          <ScreenContainer
            headerLeft={
              <CancelButton
                onPress={() => navigation.navigate('NotificationHome')}
              />
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
              {link.claims.length} {link.claims.length > 1 ? 'claims' : 'claim'}
              . Private
            </H3>
            <ScrollView>
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
            </ScrollView>
          </ScreenContainer>
        </Footer>
      ) : (
        <H2>Loading the link ... </H2>
      )}
    </>
  );
};

export default NotificationInfo;
