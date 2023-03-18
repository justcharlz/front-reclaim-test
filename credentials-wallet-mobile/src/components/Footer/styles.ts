import styled from "styled-components/native";

export const FooterView = styled.View<{height?: string}>`
align-items: center;
padding-top: 10px;
padding-bottom: 10px;
margin-top: 4px;
border-top-left-radius: 20px;
border-top-right-radius: 20px;
background-color: ${(props) => props.theme.palette.common.lightGray};
maxHeight: ${props => props.height ?? '5%'};
minHeight: ${props => props.height ?? '5%'};
`;

export const ExtendedScrollView = styled.ScrollView`
border-radius: 16px;
background-color: ${(props) => props.theme.palette.common.white};
`;