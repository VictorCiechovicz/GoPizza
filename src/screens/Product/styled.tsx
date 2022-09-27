import styled, { css } from 'styled-components'
import { LinearGradient } from 'expo-linear-gradient'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

export const Container = styled.view`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
`
export const Header = styled(LinearGradient).attrs(({ theme }) => ({
  colors: theme.COLORS.GRADIENT
}))`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  padding: ${getStatusBarHeight() + 33}px 20px 24px;
`

export const Title = styled.text`
  font-size: 24px;

  ${({ theme }) => css`
    font-family: ${theme.FONTS.TITLE};
    color: ${theme.COLORS.TITLE};
  `};
`;

export const DeleteLabel=styled.text`
font-size: 14px;

${({ theme }) => css`
  font-family: ${theme.FONTS.TITLE};
  color: ${theme.COLORS.TITLE};
`};

`;