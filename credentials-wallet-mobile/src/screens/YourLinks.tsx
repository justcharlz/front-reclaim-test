import React, {useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '.';
import ScreenContainer from '@app/components/ScreenContainer';
import messages from '@app/lib/messages.json';
import ActionButton from '@app/components/ActionButton';
import {H3, RightView} from '@app/lib/styles/common';
import Card from '@app/components/Card';
import {useReduxSelector} from '@app/redux/config';
import {getLinksList} from '@app/redux/links/selectors';
import LinkCardContent from '@app/components/LinkCardContent';
import {Link} from '@app/redux/links/types';
import {useReduxDispatch} from '@app/redux/config';
import {resetTempLink, setTempLink} from '@app/redux/links';
import uuid from 'react-native-uuid';
import {ScrollView} from 'react-native-gesture-handler';
import {
  getUserPrivateKey,
  getUserPublicKey,
} from '@app/redux/userWallet/selectors';
import {
  generateEphemeralWallet,
} from '@app/redux/userWallet/actions';
import {Template} from '@app/redux/templates/types';
import { createNewLink } from '@app/redux/links/actions';

type Props = NativeStackScreenProps<RootStackParamList, 'YourLinks'>;

const YourLinks: React.FC<Props> = ({navigation}) => {
  const links = useReduxSelector(getLinksList);
  const publicKey = useReduxSelector(getUserPublicKey);
  const dispatch = useReduxDispatch();

  const handleShareClick = React.useCallback(
    (link: Link) => {
      navigation.navigate('LinkCreated', {link});
    },
    [navigation],
  );

  const renderLinkScreen = React.useCallback(
    (link: Link) => {
      // navigation.navigate('LinkScreen', {link});
    },
    [navigation],
  );

  const renderTemplateScreen = React.useCallback(
    (template: Template) => {
      navigation.navigate('Template', {template});
    },
    [navigation],
  );

  const handleCreateLink = React.useCallback(() => {
    dispatch(resetTempLink());
    dispatch(createNewLink(publicKey))
    navigation.navigate('CreateLink');
  }, [dispatch, navigation, publicKey]);

  useEffect(() => {
    dispatch(generateEphemeralWallet(false));
  }, [dispatch]);

  return (
    <ScreenContainer
      navigation={navigation}
      headerRight={
          <ActionButton
            onPress={handleCreateLink}
            text={messages.common.create}
          />
      }
      title={messages.yourLinks.title}>
      {!links.length && (
        <H3>{messages.yourLinks.noLinks}</H3>
      )}
      <ScrollView>
        {links &&
          links.map((link, index) => {
            return (
              <Card key={index}>
                <LinkCardContent
                  link={link}
                  handleShareClick={() => handleShareClick(link)}
                  handleMenuButtonPress={() =>
                    link.template
                      ? renderTemplateScreen(link.template)
                      : renderLinkScreen(link)
                  }
                />
              </Card>
            );
          })}
      </ScrollView>
    </ScreenContainer>
  );
};

export default YourLinks;
