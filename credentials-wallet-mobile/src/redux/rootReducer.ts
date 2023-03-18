import {combineReducers} from '@reduxjs/toolkit';
import linksReducer from './links';
import googleReducer from './google';
import githubReducer from './github';
import notificationsReducer from './notifications';
import userWalletReducer from './userWallet';
import mintedClaimReducer from './mintedClaims';
import linkDetailsReducer from './link';

const rootReducer = combineReducers({
  links: linksReducer,
  google: googleReducer,
  github: githubReducer,
  notifications: notificationsReducer,
  userWallet: userWalletReducer,
  mintedClaim: mintedClaimReducer,
  linkDetails: linkDetailsReducer,
});

export default rootReducer;
