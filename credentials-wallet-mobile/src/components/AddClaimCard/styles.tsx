import styled from "styled-components/native";
import { Container } from "@app/components/Card/styles";

export const GrayContainer = styled(Container)`
    background-color: ${props => props.theme.palette.common.lightGray};
    border-color: ${props => props.theme.palette.common.lightGray};
`;

export const InfoContainer = styled.View`
    margin-top: 16px;
`;