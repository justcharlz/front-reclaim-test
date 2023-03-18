import {StyledButton, StyledRoundCtaButton} from './styles';
import React from 'react';
import {H3, Bold} from '@app/lib/styles/common';
import theme from '@app/lib/styles/theme';

interface Props {
  onPress: () => void;
  backgroundColor?: string;
  text?: string;
  textColor?: string;
  width?: string;
  isDisabled?: boolean;
}

const CtaButton: React.FC<Props> = ({
  onPress,
  text,
  backgroundColor,
  textColor,
  width,
  isDisabled,
}) => {
  return (
    <StyledButton
      onPress={onPress}
      backgroundColor={backgroundColor}
      width={width}
      disabled={isDisabled}>
      <H3 color={textColor ?? theme.palette.common.white}>
        <Bold>{text}</Bold>
      </H3>
    </StyledButton>
  );
};

const RoundCtaButton: React.FC<Props> = ({
  onPress,
  text,
  backgroundColor,
  textColor,
  width,
  isDisabled,
}) => {
  return (
    <StyledRoundCtaButton
      onPress={onPress}
      backgroundColor={backgroundColor}
      width={width}
      disabled={isDisabled}>
      <H3 color={textColor ?? theme.palette.common.white}>
        <Bold>{text}</Bold>
      </H3>
    </StyledRoundCtaButton>
  );
};

export {CtaButton, RoundCtaButton};
