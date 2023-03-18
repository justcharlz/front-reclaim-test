import styled from "styled-components/native";

interface SizeImageProps{
    height: number,
    width: number
}
export const SizedImage = styled.Image<SizeImageProps>`
    height: ${props => props.height}px;
    width: ${props => props.width}px;
`;