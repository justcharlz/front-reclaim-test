import React, {useState} from 'react';
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
import {SvgXml} from 'react-native-svg';
import {searchIcon} from '@app/assets/svgs';
import { ProviderBodyProps } from '@app/providers';
import { getUserNameSelector } from '@app/redux/github/selectors';

const MarginLeft = makeMarginLeftComponent(0);
const MarginTop = makeMarginTopComponent(1);

const GithubProvider: React.FC<ProviderBodyProps> = ({provider, navigate}) => {
  const userName = useReduxSelector(getUserNameSelector);
  const [value, onChangeText] = React.useState('');
  const [descending, setDescending] = useState<boolean>(true);
  const link = useReduxSelector(getLastLink);
  const dispatch = useReduxDispatch();

  function reOrder() {
    setDescending(!descending);
  }

  const handleCreateClaim = React.useCallback(() => {
    const updatedLink = {
      ...link,
      claims: [
        ...link.claims,
        {
          id: uuid.v4().toString(),
          title: 'Github Repository',
          provider: provider,
          params: {},
          status: ClaimStatus.PENDING,
        },
      ],
    };
    // dispatch(updateLink(updatedLink));
    navigate();
  }, [link, dispatch, navigate]);

  return (
    <>
      <FlexRow>
        <Image source={require('@app/assets/github.png')} />
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
      <FlexColumn gap="20px">
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
        <Card>
          <H3 color={theme.palette.common.black}>
            <Bold>Contributed to a repository</Bold>
          </H3>
          <MarginTop />
          <CtaButton
            onPress={handleCreateClaim}
            backgroundColor={theme.palette.common.lightGray}
            text={'Create Claim'}
            textColor={theme.palette.common.black}
          />
        </Card>
      </FlexColumn>
    </>
  );
};

export default GithubProvider;
