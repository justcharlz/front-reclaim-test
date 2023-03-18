import {FlexRow, H3} from '@app/lib/styles/common';
import {
  Container,
  HeaderContainer,
  BodyContainer,
  FooterContainer,
} from './styles';
import {SvgXml} from 'react-native-svg';
import {truncVerifier} from '@app/lib/utils/helpers';
import {billPic} from '../../../public/billPic';
import {RoundCtaButton} from '../CtaButton';
import messages from '@app/lib/messages.json';
import theme from '@app/lib/styles/theme';
import {useState} from 'react';
import {
  rejectVerificationRequest,
  acceptVerificationRequest,
} from '@app/redux/verificationRequests/actions';
import {useReduxDispatch, useReduxSelector} from '@app/redux/config';
import {getLocalClaims} from '@app/redux/mintedClaims/selectors';

interface Props {
  request: GetVerificationRequestsResponse['requests'][0];
}

const RequestCard: React.FC<Props> = ({request}) => {
  const dispatch = useReduxDispatch();
  let requestStatus = 'Pending';
  if (request.status === VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_PENDING_APPROVAL) {
    requestStatus = 'Approved';
  }
  if (request.status === VerificationRequestStatus.VERIFICATION_REQUEST_STATUS_REJECTED) {
    requestStatus = 'Declined';
  }
  const [status, setStatus] = useState<string>(requestStatus);

  const claims = request.link.claimsList;

  const handleAcceptVerificationRequest = async () => {
    setStatus('Approving ...');
    dispatch(
      acceptVerificationRequest({
        verificationReqId: request.id,
        communicationPublicKey: request.communicationpublickey,
        claims: claims,
      }),
    )
      .then((res: any) => {
        if (res.payload) {
          setStatus('Approved');
        } else {
          setStatus('Failed to approve, try again please');
        }
      })
      .catch((e: any) => {
        console.log(e);
        setStatus('Failed to decline, try again please');
      });
  };

  const handleDeclineVerificationRequest = async () => {
    setStatus('Declining ...');
    dispatch(rejectVerificationRequest({verificationReqId: request.id})).then(
      (res: any) => {
        if (res.payload) {
          setStatus('Declined');
        } else {
          setStatus('Failed to decline, try again please');
        }
      },
    );
  };

  return (
    <Container>
      <HeaderContainer>
        <FlexRow>
          <SvgXml xml={billPic} />
          <H3 color="black" weight="500">
            {'  '}
            {truncVerifier(request.requestorId)}
          </H3>
          <H3 weight="500"> wants access</H3>
        </FlexRow>
      </HeaderContainer>
      <BodyContainer>
        <H3 color="black" weight="500">
          Hey! This a request for link verification.
        </H3>
      </BodyContainer>
      <FooterContainer>
        {status === 'Pending' ? (
          <>
            <RoundCtaButton
              onPress={() => handleAcceptVerificationRequest()}
              text={messages.common.approve}
              width="50%"
            />
            <RoundCtaButton
              onPress={() => handleDeclineVerificationRequest()}
              text={messages.common.decline}
              width="50%"
              textColor={theme.palette.common.darkGray}
              backgroundColor={theme.palette.common.lightGray}
            />
          </>
        ) : (
          <RoundCtaButton
            onPress={() => {}}
            text={status}
            textColor={theme.palette.common.darkGray}
            backgroundColor={theme.palette.common.lightGray}
          />
        )}
      </FooterContainer>
    </Container>
  );
};

export default RequestCard;
