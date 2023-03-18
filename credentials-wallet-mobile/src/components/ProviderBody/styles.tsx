import theme from '@app/lib/styles/theme';
import styled from 'styled-components/native';

export const TextView = styled.View`
  display: flex;
  flex-direction: row;
`;

export const SearchBar = styled.TextInput`
  background-color: ${theme.palette.common.blue};
`;

export const SearchView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  background-color: ${theme.palette.common.gray6};
  border-radius: 12px;
  height: 48px;
  padding-left: 15px;
`;

export const ClaimsContainer = styled.View<{gap?: string}>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.gap ?? '0px'};
  height: 100%;
`;
