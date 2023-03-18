import {H2, H3, RightView} from '@app/lib/styles/common';
import ArrowCancelButton from '../ArrowCancelButton';
import {
  Container,
  HeaderContainer,
  BodyContainer,
  FooterContainer,
  TextContainer,
} from './styles';
import messages from '@app/lib/messages.json';
import {RoundCtaButton} from '../CtaButton';
import RequestCard from '../RequestCard';
import {ScrollView} from 'react-native-gesture-handler';
import { GetVerificationRequestsResponse } from '@questbook/reclaim-client-sdk';

interface Props {
  setIsOpenRequestSheet: (value: boolean) => void;
  request: GetVerificationRequestsResponse['requests'][0];
}

const RequestsView: React.FC<Props> = ({setIsOpenRequestSheet, request}) => {
  return (
    <Container>
      <HeaderContainer>
        <H2>Requests</H2>
        <RightView>
          <ArrowCancelButton
            onPress={() => {
              setIsOpenRequestSheet(false);
            }}></ArrowCancelButton>
        </RightView>
      </HeaderContainer>

      <ScrollView>
        <BodyContainer>
          <RequestCard request={request}></RequestCard>
        </BodyContainer>
      </ScrollView>
      <FooterContainer>
        <TextContainer>
          <H3 color="black" weight="700">
            Only you
          </H3>
          <H3>Share to give others access</H3>
        </TextContainer>
        <RightView></RightView>
        <RoundCtaButton
          onPress={() => console.log("Share isn't implemented yet")}
          text={messages.common.share}
          width="20%"
        />
      </FooterContainer>
    </Container>
  );
};

export default RequestsView;
