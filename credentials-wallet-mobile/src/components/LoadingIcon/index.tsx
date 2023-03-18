import { CenteredImage, LoadingContainer } from '@app/components/LoadingIcon/style';
import React from 'react';

const LoadingIcon: React.FC = () => {
    return <LoadingContainer>
        <CenteredImage source={require('@app/assets/loading.gif')}/>
    </LoadingContainer>;
}

export default LoadingIcon;
    