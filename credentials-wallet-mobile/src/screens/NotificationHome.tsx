import React, {useEffect} from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import messages from '@app/lib/messages.json';
import {
  NotificationContainer,
  NotificationView,
  H3,
  H2,
  RightView,
  FlexRow,
  NotificationText,
} from '@app/lib/styles/common';
import ScreenContainer from '@app/components/ScreenContainer';
import ActionButton from '@app/components/ActionButton';
import {profileIcon} from '../../public/profile';
import {SvgXml} from 'react-native-svg';
import {useReduxSelector} from '@app/redux/config';
import {getNotificationsList} from '@app/redux/notifications/selectors';
import MenuButton from '@app/components/MenuButton';
import {NotificationType} from '@app/redux/notifications/types';
import {useReduxDispatch} from '@app/redux/config';
import {readNotification} from '@app/redux/notifications';
import BackButton from '@app/components/BackButton';
import { RootStackParamList } from '@app/screens';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'NotificationHome'
>;

const NotificationHome: React.FC<Props> = ({navigation}) => {
  const dispatch = useReduxDispatch();
  const notifications = useReduxSelector(getNotificationsList);

  useEffect(() => {
    dispatch(readNotification());
  }, []);

  return (
    <ScreenContainer
      headerLeft={
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      }
      headerRight={
        <ActionButton
          onPress={() => navigation.navigate('Settings')}
          text={messages.common.settings}
        />
      }
      title="Notifications">
      <NotificationView>
        {notifications.map((notification: any, index: number) => (
          <NotificationContainer
            onPress={() => {
              if (notification.type === NotificationType.NEWVRQ) {
                navigation.navigate('NotificationInfo', {
                  linkId: notification.data.linkId,
                  id: notification.id,
                });
              } else {
                navigation.navigate('VerifyClaims', {
                  id: notification.id,
                });
              }
            }}
            key={index}>
            <FlexRow gap="10px">
              <SvgXml xml={profileIcon} />
              <NotificationText>{notification.body}</NotificationText>
              <RightView>
                <MenuButton
                  onPress={() => console.log("Can't edit now")}></MenuButton>
              </RightView>
            </FlexRow>
          </NotificationContainer>
        ))}
      </NotificationView>
    </ScreenContainer>
  );
};

export default NotificationHome;
