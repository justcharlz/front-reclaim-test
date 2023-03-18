import React from 'react';
import {H4, Bold, FlexColumn} from '@app/lib/styles/common';
import theme from '@app/lib/styles/theme';
import {ClaimContainer, HighlighContainer} from '../styles';
import {SvgXml} from 'react-native-svg';
import {rightArrow} from '@app/assets/svgs';

const RepoContribution: React.FC = () => {
  return (
    <ClaimContainer>
      <H4
        color={theme.palette.common.black}
        weight="700"
        fontSize="17px"
        lineHeight="20px">
        <Bold>Contributed to</Bold>
      </H4>
      <HighlighContainer color="rgba(51, 47, 237, 0.1)">
        <H4
          color={theme.palette.common.blue}
          weight="700"
          fontSize="17px"
          lineHeight="20px">
          Repository
        </H4>
        <SvgXml xml={rightArrow} />
      </HighlighContainer>
    </ClaimContainer>
  );
};

export default RepoContribution;
