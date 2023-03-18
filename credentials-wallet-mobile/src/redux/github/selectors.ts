import { RootState } from '@app/redux/config';

export const getAccessTokenSelector = (state: RootState) =>
    state.github.accessToken;

export const getUserNameSelector = (state: RootState) =>
    state.github.userName;
