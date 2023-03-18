import { ClaimStatus } from "@app/redux/links/types";
import React from "react";
import {
  BodyView,
  H2,
  H3,
  makeMarginTopComponent,
  MetaActionBar,
  FlexRow,
  FlexColumn,
  ScreenTitle,
  Bold,
} from '@app/lib/styles/common';
import ProviderIcon from '@app/components/ProviderIcon';
import {providers} from '@app/lib/providersConfig';
import { SizedImage } from "@app/components/ProviderIcon/styles";
import { ProviderType } from "@app/providers";

const CardHeader: React.FC<{ provider: ProviderType, status: ClaimStatus }> = ({ provider, status }) => {
    if(status === ClaimStatus.PENDING) return <FlexRow gap={"10px"}>
        <SizedImage source={require('@app/assets/loader-rec.png')} height={24} width={24}/>
        <H3> 
            <Bold>
                Verifying...
            </Bold> 
        </H3>
      </FlexRow>

    return <FlexRow gap={"10px"}>
        <ProviderIcon provider={provider} height={24} width={24}/>
        <H3> 
            <Bold>
                {providers[provider].title}
            </Bold> 
        </H3>
    </FlexRow>;
}

export default CardHeader;
