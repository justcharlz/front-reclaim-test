import React from 'react';
import {WebView} from 'react-native-webview';
import {useReduxSelector, useReduxDispatch} from '@app/redux/config';
import {getAccessTokenSelector} from '@app/redux/github/selectors';
import {getUserNameSelector} from '@app/redux/github/selectors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@app/screens';
import getAccessToken, {getUserName} from '@app/lib/utils/githubAuth';
import {setAccessToken, setUserName} from '@app/redux/github';

type Props = NativeStackScreenProps<RootStackParamList, 'GithubAuth'>;

const GithubAuth: React.FC<Props> = ({navigation}) => {
  const [code, setCode] = React.useState('');
  const accessToken = useReduxSelector(getAccessTokenSelector);
  const userName = useReduxSelector(getUserNameSelector);
  const disptach = useReduxDispatch();

  React.useEffect(() => {
    if (code === '') {
      return;
    }

    if (accessToken) {
      if (!userName) {
        getUserName(accessToken).then(user => {
          disptach(setUserName(user.login));
        });
      }
      navigation.replace('PossibleClaims', {provider: 'github'});
      return;
    }
    console.log('getting access token');
    getAccessToken(code)
      .then(token => {
        getUserName(token.access_token).then(user => {
          disptach(setUserName(user.login));
        });
        disptach(setAccessToken(token.access_token));
      })
      .then(() => navigation.replace('PossibleClaims', {provider: 'github'}));
  }, [code, accessToken, navigation, disptach]);

  return (
    <WebView
      source={{
        uri: 'https://github.com/login/oauth/authorize?client_id=37e18671bfc332d88a67',
      }}
      onNavigationStateChange={e =>
        e.url.includes('code') && setCode(e.url.split('=')[1])
      }
    />
  );
};

export default GithubAuth;
