import { WithBackground } from "@app/lib/styles/common";
import React from "react";
import theme from "@app/lib/styles/theme";
import { BodyEmphasized } from "@app/lib/styles/common";
import { Container } from './styles';

interface Props{
    text: string;
}

export const HighlitedText: React.FC<Props> = ({ text }) => {
    return <Container background={theme.palette.accentBackground}>
            <BodyEmphasized color={theme.palette.accentColor}>
                {text}
            </BodyEmphasized>
        </Container>
}
    