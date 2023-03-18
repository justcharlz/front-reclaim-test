import React from 'react';
import {H4, Bold} from '@app/lib/styles/common';
import theme from '@app/lib/styles/theme';
import {HighlighContainer, ClaimContainer} from '../styles';

interface Props {
  username: string | undefined;
}

const OwnsUserName: React.FC<Props> = ({username}) => {
  return (
    <ClaimContainer>
      <H4
        color={theme.palette.common.black}
        weight="700"
        fontSize="17px"
        lineHeight="20px">
        <Bold>Owns username</Bold>
      </H4>
      <HighlighContainer>
        <H4
          color={theme.palette.common.black}
          weight="700"
          fontSize="17px"
          lineHeight="20px">
          {username}
        </H4>
      </HighlighContainer>
    </ClaimContainer>
  );
};

export default OwnsUserName;
