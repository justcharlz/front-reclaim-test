import React from 'react';
import {SvgXml} from 'react-native-svg';
import { Pressable } from 'react-native';
import {nextIconXml} from '../../assets/svgs';

interface Props {
  onPress: () => void;
}

const NextButton: React.FC<Props> = ({onPress}) => {
  return (
    <Pressable onPress={onPress} >
      <SvgXml xml={nextIconXml} />
    </Pressable>
  )
};

export default NextButton;
