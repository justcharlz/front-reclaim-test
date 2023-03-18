import React from 'react';
import {SvgXml} from 'react-native-svg';
import {Pressable} from 'react-native';
import {arrowCancelIconXml} from '../../assets/svgs';

interface Props {
  onPress: () => void;
}

const ArrowCancelButton: React.FC<Props> = ({onPress}) => {
  return (
    <Pressable onPress={onPress}>
      <SvgXml xml={arrowCancelIconXml} width="24px" height="24px" />
    </Pressable>
  );
};

export default ArrowCancelButton;
