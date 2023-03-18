import React from 'react';
import Card from '../Card';
import {H2, H3, makeMarginTopComponent, Bold} from '@app/lib/styles/common';
import theme from '@app/lib/styles/theme';
import {CtaButton} from '../CtaButton';
import {Image} from 'react-native';
import OwnsUserName from './PossibleClaims/ownsUserName';
import {HeaderContainer} from './styles';
// import { githubIcon } from 'public/icons/github';
import {SvgXml} from 'react-native-svg';
import {githubIcon} from '../../../public/icons/github';
import {googleIcon} from '../../../public/icons/google';
import RepoContribution from './PossibleClaims/repoContribution';
import OwnsEmail from './PossibleClaims/ownsEmail';
import {ProviderType} from '@app/providers';

interface Props {
  provider: ProviderType;
  claim: string;
  username?: string;
  onPress: (claim: string) => void;
}

const MarginTop = makeMarginTopComponent(1);

const PossibleClaimCard: React.FC<Props> = ({
  provider,
  claim,
  username,
  onPress,
}) => {
  return (
    <Card>
      <HeaderContainer>
        {provider === 'github' && (
          <>
            <SvgXml xml={githubIcon} />
            <H3 color="black">Github</H3>
          </>
        )}
        {provider === 'google-login' && (
          <>
            <SvgXml xml={googleIcon} />
            <H3 color="black">Google</H3>
          </>
        )}
      </HeaderContainer>
      {claim === 'ownsUserName' && <OwnsUserName username={username} />}
      {claim === 'repoContribution' && <RepoContribution />}
      {claim === 'ownsEmail' && <OwnsEmail email={username} />}

      <MarginTop />
      <CtaButton onPress={() => onPress(claim)} text={'Add claim'} />
    </Card>
  );
};

export default PossibleClaimCard;
