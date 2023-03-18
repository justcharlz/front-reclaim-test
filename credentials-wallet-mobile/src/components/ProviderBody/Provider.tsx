import React, {useState, useRef, useMemo, useCallback} from 'react';
import {Image, View, Text, TextInput} from 'react-native';
import theme from '@app/lib/styles/theme';
import {
  Bold,
  FlexColumn,
  FlexRow,
  H2,
  H3,
  makeMarginLeftComponent,
  makeMarginTopComponent,
  RightView,
} from '@app/lib/styles/common';
import messages from '@app/lib/messages.json';
import Card from '@app/components/Card';
import {CtaButton} from '@app/components/CtaButton';
import {useReduxDispatch, useReduxSelector} from '@app/redux/config';
import {getLastLink} from '@app/redux/links/selectors';
import uuid from 'react-native-uuid';
import {updateLink} from '@app/redux/links';
import {ClaimStatus} from '@app/redux/links/types';
import {SearchView, TextView} from './styles';
import UsedOrder from '../UsedOrder';
import {SearchBar} from './styles';
import {SvgXml} from 'react-native-svg';
import {searchIcon} from '@app/assets/svgs';
import PossibleClaimCard from '../PossibleClaimCard';
import {ScrollView} from 'react-native-gesture-handler';
import BottomSheetView from '@app/components/BottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  getUserContribution,
  fetchUserContribution,
} from '@app/lib/utils/helpers';
import {
  getAccessTokenSelector,
  getUserNameSelector,
} from '@app/redux/github/selectors';
import RepoCard from '../RepoCard';
import {ClaimsContainer} from './styles';
import {addClaim} from '@app/redux/links/actions';

interface Props {
  provider: string;
  navigate: () => void;
  userName: string;
}

interface ContributionsTypes {
  name: string;
  owner: string;
  avatarURL?: string;
  lastCommit: string;
}

const claims = {
  'google-login': ['ownsEmail'],
  github: ['ownsUserName', 'repoContribution'],
};
const MarginLeft = makeMarginLeftComponent(0);
const MarginTop = makeMarginTopComponent(1);

const Provider: React.FC<Props> = ({provider, navigate, userName}) => {
  const [value, onChangeText] = React.useState('');
  const [repoValue, onChangeRepoText] = React.useState('');
  const [descending, setDescending] = useState<boolean>(true);
  const link = useReduxSelector(getLastLink);
  const dispatch = useReduxDispatch();
  const accessToken = useReduxSelector(getAccessTokenSelector);
  const [data, setData] = React.useState<ContributionsTypes[]>([]);

  const [isOpenShareSheet, setIsOpenShareSheet] = React.useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['25%', '86%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  function reOrder() {
    setDescending(!descending);
  }

  const handleAddClaim = React.useCallback(
    async (provider: string, claim: string, param?: string) => {
      try {
        console.log(
          'Adding the claims with ',
          provider,
          ' and claim is: ',
          claim,
          ' Params are: ',
          param,
        );
        await dispatch(addClaim({provider, claim, param}));
      } catch (e) {
        console.log(e);
      }
      navigate();
    },
    [link, dispatch, navigate],
  );

  function handleCreateClaim(claim: string) {
    console.log('Claim here is: ', claim);
    if (claim === 'repoContribution') {
      setIsOpenShareSheet(true);
      getContribution();
    }
    if (claim === 'ownsUserName') {
      handleAddClaim('github', 'ownsUserName', userName);
    }
    if (claim === 'ownsEmail') {
      handleAddClaim('google-login', 'ownsEmail', userName);
    }
  }

  async function getContribution() {
    const contributions = await getUserContribution(accessToken);
    setData(contributions);
  }

  return (
    <>
      <FlexRow>
        {provider === 'google-login' && (
          <Image source={require('@app/assets/google.png')} />
        )}
        {provider === 'github' && (
          <Image source={require('@app/assets/github.png')} />
        )}
        <MarginLeft />
        <View>
          <H2>{messages.common.github}</H2>
          <TextView>
            <H3 color={theme.palette.common.black}>
              {messages.possibleClaims.signedInAs}
            </H3>
            <H3 color={theme.palette.common.black} weight="bold">
              {' '}
              {userName}
            </H3>
          </TextView>
        </View>
      </FlexRow>
      <MarginTop />
      <ClaimsContainer gap="20px">
        <UsedOrder descending={descending} reOrder={reOrder} />
        <SearchView>
          <SvgXml xml={searchIcon} />
          <TextInput
            editable
            maxLength={40}
            onChangeText={text => onChangeText(text)}
            value={value}
            placeholder="Search claims"
          />
        </SearchView>
        <ScrollView>
          <>
            {claims[provider as keyof typeof claims] &&
              claims[provider as keyof typeof claims].map((claim, index) => {
                return (
                  <PossibleClaimCard
                    key={index}
                    provider={provider}
                    claim={claim}
                    username={userName}
                    onPress={handleCreateClaim}
                  />
                );
              })}
          </>
        </ScrollView>
        {isOpenShareSheet && (
          <BottomSheetView
            title="Find repository"
            bottomSheetRef={bottomSheetRef}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            setOpenSheet={setIsOpenShareSheet}>
            <SearchView>
              <SvgXml xml={searchIcon} />
              <TextInput
                editable
                maxLength={40}
                onChangeText={text => onChangeRepoText(text)}
                value={repoValue}
                placeholder="Search claims"
              />
            </SearchView>
            <ScrollView>
              {data.length > 0 ? (
                data.map((repo, index) => (
                  <RepoCard
                    key={index}
                    onPress={handleAddClaim}
                    name={repo.name}
                    owner={repo.owner}
                    lastCommit={repo.lastCommit}
                  />
                ))
              ) : (
                <H3>Loading data from your github account ... </H3>
              )}
            </ScrollView>
          </BottomSheetView>
        )}
      </ClaimsContainer>
    </>
  );
};

export default Provider;
