import {
  GrayContainer,
  InfoContainer,
} from '@app/components/AddClaimCard/styles';
import PlusButton from '@app/components/PlusButton';
import {H2} from '@app/lib/styles/common';
import React from 'react';
import messages from '@app/lib/messages.json';
import {GrayH3} from '@app/components/LinkCardContent/styles';

interface Props {
  handleAddPress: () => void;
}

const AddClaimCard: React.FC<Props> = ({handleAddPress}) => {
  return (
    <GrayContainer>
      <PlusButton onPress={handleAddPress} />
      <InfoContainer>
        <H2>{messages.createLink.card.title}</H2>
        <GrayH3>{messages.createLink.card.description}</GrayH3>
      </InfoContainer>
    </GrayContainer>
  );
};

export default AddClaimCard;
