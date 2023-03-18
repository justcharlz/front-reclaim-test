import {View} from 'react-native';
import {ScrollView} from 'react-native';
import {Text} from 'react-native';
import {FooterView, ExtendedScrollView} from './styles';

interface Props {
  footer: React.ReactNode;
  children: React.ReactNode;
  height?: string;
}

const Footer: React.FC<Props> = ({footer, children, height}) => {
  return (
    <View style={{flex: 1}}>
      <ExtendedScrollView>{children}</ExtendedScrollView>
      <FooterView height={height}>{footer}</FooterView>
    </View>
  );
};

export default Footer;
