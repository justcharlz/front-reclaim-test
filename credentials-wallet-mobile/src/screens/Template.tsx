import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@app/screens';
import {
    BodyEmphasized,
    FlexColumn,
    H1,
    H2,
    H3,
    makeMarginTopComponent,
    makeMarginBottomComponent,
    MetaActionBar,
  } from '@app/lib/styles/common';
import CancelButton from '@app/components/CancelButton';
import { useReduxDispatch, useReduxSelector } from '@app/redux/config';
import { addLink, updateLink } from '@app/redux/links';
import { getUserPublicKey } from '@app/redux/userWallet/selectors';
import { getLastLink, getLinkById } from '@app/redux/links/selectors';
import { RoundCtaButton } from '@app/components/CtaButton';
import theme from '@app/lib/styles/theme';
import ScreenContainer from '@app/components/ScreenContainer';
import Card from '@app/components/Card';
import { Template as TemplateType, TemplateClaim } from '@app/redux/templates/types';
import { transformBaseTemplate } from '@app/redux/templates/transforms';
import { addTemplateClaim } from '@app/redux/links/actions';
import ClaimCardContent from '@app/components/ClaimCardContent';
import { getClaimByIdFromLink, getVerifiedClaimsLength } from '@app/redux/links/utils';
import { isAppLoading } from '@app/redux/selectors';
import LoadingIcon from '@app/components/LoadingIcon';
import { handleSubmitTemplateLink } from '@app/redux/templates/actions';

type Props = NativeStackScreenProps<RootStackParamList, 'Template'>;

const MarginBottom = makeMarginBottomComponent(0);
const MarginTop = makeMarginTopComponent(0);

const Template: React.FC<Props> = ({ navigation, route }) => {
    const { template: baseTemplate } = route.params;

    const [template, setTemplate] = React.useState<TemplateType | undefined>();

    React.useEffect(() => {
        setTemplate(transformBaseTemplate(baseTemplate));
    }, [baseTemplate])
    
    const dispatch = useReduxDispatch();
    const publicKey = useReduxSelector(getUserPublicKey);
    const link = useReduxSelector(getLinkById(template && template.id));

    React.useEffect(() => {
        if(!publicKey || !dispatch || !template) return;

        if(link === undefined)
            dispatch(
                addLink({
                    id: template.id,
                    name: template.name,
                    claims: [],
                    userId: publicKey,
                    createdAtS: Math.floor(Date.now() / 1000),
                    views: 0,
                    template,
                    isSubmitted: false
                }),
            );
    }, [publicKey, dispatch, template, link])
    
    const handleCreateClaim = React.useCallback(async (claim: TemplateClaim) => {
        if(link === undefined) return;
        try{
            dispatch(addTemplateClaim({ claim, link }));
        } catch(e){
            console.log(e);
        }
    }, [dispatch, link]);
    const isLoading = useReduxSelector(isAppLoading);

    const isComplete = link && getVerifiedClaimsLength(link) === template?.claims.length && !link.isSubmitted;
    if(!template || !link) return <></>;

    if(isLoading) return <LoadingIcon/>;
    return (
        <ScreenContainer
            navigation={navigation}
            headerLeft={
                <CancelButton onPress={() => navigation.navigate('YourLinks')} />
            }
            footer={
                <>
                    <MetaActionBar>
                        <FlexColumn>
                            <BodyEmphasized>
                                {`${getVerifiedClaimsLength(link)} of ${template.claims.length} claims verified`}
                            </BodyEmphasized>
                        </FlexColumn>
                        <RoundCtaButton
                            text="Submit"
                            textColor={isComplete ? theme.palette.common.white : theme.palette.common.darkGray}
                            backgroundColor={isComplete ? theme.palette.accentColor : theme.palette.common.lightGray}
                            width="108px"
                            onPress={async () => {
                                await dispatch(handleSubmitTemplateLink({ link }));
                                navigation.navigate('YourLinks');
                            }}
                            isDisabled={!isComplete}
                        />
                    </MetaActionBar>
                    <MarginBottom />
                </>
            }
        >
            <H1>{template.name}</H1>
            {/* <H2>{truncVerifier(ethers.utils.computeAddress(template.publicKey))}</H2> */}
            <H3>{template.claims.length} required claims</H3>
            <MarginTop/>
            {
                template.claims.map((claim, index) => {
                    const linkClaim = getClaimByIdFromLink(link, claim.id);
                    return <Card key={index}>
                        {
                            linkClaim ? <ClaimCardContent claim={linkClaim}/> :
                                <ClaimCardContent claim={claim} handleCreateClaim={handleCreateClaim}/>
                        }
                    </Card>
                })
            }
        </ScreenContainer>
    );
};

export default Template;