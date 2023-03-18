import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SvgXml} from 'react-native-svg';
import { Pressable } from 'react-native';
import {menuIconXml} from '../../assets/svgs';

interface Props {
  onPress: () => void;
}

const MenuButton: React.FC<Props> = ({onPress}) => {
  return (
    <Pressable onPress={onPress} >
      <SvgXml xml={menuIconXml} />
    </Pressable>
  )
};

export default MenuButton;
