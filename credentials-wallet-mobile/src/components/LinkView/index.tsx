import React from 'react';
import {linkIconXml} from '@app/assets/svgs';
import {SvgXml} from 'react-native-svg';
import {LinkContainer, LinkHeader} from './styles';
import {Bold, H3} from '@app/lib/styles/common';
import {Text} from 'react-native';
import theme from '@app/lib/styles/theme';

interface Props {
  linkTitle: string;
  owner: string;
}

const LinkView: React.FC<Props> = ({linkTitle, owner}) => {
  return (
    <LinkContainer>
      <SvgXml xml={linkIconXml} />
      <LinkHeader>
        <H3 color={theme.palette.common.black}>
          <Bold>{linkTitle}</Bold>
        </H3>
        <Text>{owner}</Text>
      </LinkHeader>
    </LinkContainer>
  );
};

export default LinkView;