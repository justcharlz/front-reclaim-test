import { typedCreateAsyncThunk } from './extraConfig';
import {getClient} from '@app/lib/client';
import { initFcmToken, initWallet } from '@app/redux/userWallet/actions';
import { getFcmToken, getUserPrivateKey } from '@app/redux/userWallet/selectors';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { WEB_CLIENT_ID } from '@app/lib/utils/constants';

export const initApp = typedCreateAsyncThunk<
  void,
  {}
>(
  'app/initAppStatus',
  async ({}, { dispatch, getState}) => {
    await dispatch(initWallet({}));

    await dispatch(initFcmToken({}));

    const state = getState();
    const privateKey = getUserPrivateKey(state);
    const client = getClient(privateKey);
    const fcmToken = getFcmToken(state);

    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
    });

    if(!fcmToken) throw Error('Fcm token not found.');
    if(!client) throw Error('client not found.');

    const response = await client.updateUser(fcmToken);
  }
);