import React from 'react';
import {H1, RightView} from '@app/lib/styles/common';
import {
  BodyContainer,
  Container,
  FooterContainer,
  HeaderContainer,
  HeaderLeftContainer,
  HeaderMiddleContainer,
  HeaderRightContainer,
  TitleContainer,
} from './styles';
import { Pressable, SafeAreaView } from 'react-native';
import { useReduxSelector } from '@app/redux/config';
import { getNotificationsReadStatus } from '@app/redux/notifications/selectors';
import { SvgXml } from 'react-native-svg';
import { unReadBell, bellIcon } from '@app/assets/svgs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app/screens';


interface Props<T extends keyof RootStackParamList> {
  headerLeft?: React.ReactNode;
  headerMiddle?: React.ReactNode;
  headerRight?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  navigation?: (NativeStackScreenProps<RootStackParamList, T>)["navigation"];
}

function ScreenContainer<T extends keyof RootStackParamList>({
  headerLeft,
  headerMiddle,
  headerRight,
  title,
  children,
  footer,
  navigation,
}: Props<T>){
  const readStatus = useReduxSelector(getNotificationsReadStatus);

  return (
    <Container>
      <SafeAreaView style={{ flex: 1 }}>
        <HeaderContainer>
          <HeaderLeftContainer>{headerLeft}</HeaderLeftContainer>
          <HeaderMiddleContainer>{headerMiddle}</HeaderMiddleContainer>
          <HeaderRightContainer>
            {navigation && <Pressable onPress={() => navigation.navigate('NotificationHome')}>
              {readStatus ? (
                <SvgXml xml={unReadBell}/>
              ) : (
                <SvgXml xml={bellIcon} />
              )}
            </Pressable>}
            {headerRight}
          </HeaderRightContainer>
        </HeaderContainer>
        
        {title && (
          <TitleContainer>
            <H1>{title}</H1>
          </TitleContainer>
        )}
        <BodyContainer>{children}</BodyContainer>
        {footer && <FooterContainer>{footer}</FooterContainer>}
      </SafeAreaView>
    </Container>
  );
};

export default ScreenContainer;
