import {
  H3,
  makeMarginTopComponent,
  FlexColumn,
  ScreenTitle,
  Bold,
} from '@app/lib/styles/common';
import {Claim, ClaimStatus} from '@app/redux/links/types';
import theme from '@app/lib/styles/theme';
import React from 'react';
import {getMonthAndDate} from '@app/lib/utils';
import {HighlitedText} from '@app/components/HighlitedText';
import {CtaButton} from '@app/components/CtaButton';
import CardHeader from '@app/components/ClaimCardContent/CardHeader';
import {TemplateClaim} from '@app/redux/templates/types';
import {isClaim} from '@app/redux/links/utils';

interface Props {
  claim: Claim | TemplateClaim;
  handleCreateClaim?: (claim: TemplateClaim) => void;
}

const MarginTop = makeMarginTopComponent(0);

const ClaimCardContent: React.FC<Props> = ({claim, handleCreateClaim}) => {
  const getContentByProvider = () => {
    return claim.provider === 'google-login'
      ? {
          title: 'Owns email address',
          highlitedText:
            claim.params !== undefined && claim.params['emailAddress']
              ? claim.params['emailAddress']
              : claim.redactedParameters !== undefined
              ? claim.redactedParameters
              : 'Email',
        }
      : {
          title: 'Contributed to',
          highlitedText: claim.params ? claim.params['repo'] : 'Repo',
        };
  };

  return (
    <>
      <CardHeader
        provider={claim.provider}
        status={isClaim(claim) ? claim.status : ClaimStatus.UNCLAIMED}
      />
      <MarginTop />
      <FlexColumn>
        <ScreenTitle>
          <Bold>{getContentByProvider().title}</Bold>
        </ScreenTitle>
        <HighlitedText text={getContentByProvider().highlitedText} />
      </FlexColumn>
      <MarginTop />
      {!isClaim(claim) && (
        <CtaButton
          onPress={() => handleCreateClaim && handleCreateClaim(claim)}
          backgroundColor={theme.palette.common.lightGray}
          text={'Create Claim'}
          textColor={theme.palette.common.black}
        />
      )}
      {isClaim(claim) && claim.status === ClaimStatus.MINTED && (
        <H3>
          Encrypted {getMonthAndDate(claim.timestampS)}. Signed by{' '}
          {claim.witnessAddresses.length} blind witnesses
        </H3>
      )}
    </>
  );
};

export default ClaimCardContent;
