import React from 'react';
import {SvgXml} from 'react-native-svg';
import { Pressable } from 'react-native';
import {plusIconXml} from '../../assets/svgs';

interface Props {
  onPress: () => void;
}

const PlusButton: React.FC<Props> = ({onPress}) => {
  return (
    <Pressable onPress={onPress} >
      <SvgXml xml={plusIconXml} />
    </Pressable>
  )
};

export default PlusButton;
