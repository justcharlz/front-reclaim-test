import React from 'react';
import {SvgXml} from 'react-native-svg';
import {Pressable} from 'react-native';
import {cancelIconXml} from '../../assets/svgs';

interface Props {
  onPress: () => void;
}

const CancelButton: React.FC<Props> = ({onPress}) => {
  return (
    <Pressable onPress={onPress}>
      <SvgXml xml={cancelIconXml} width="24px" height="24px" />
    </Pressable>
  );
};

export default CancelButton;
