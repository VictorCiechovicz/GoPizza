import React from 'react'

import { TouchableOpacityProps } from 'react-native'

import { Container, Title, Load, TypeProps } from './style'

type Props = TouchableOpacityProps & {
  title: string
  type?: TypeProps
  isLoading?: boolean | undefined
}

export function Button({
  title,
  type = 'primary',
  isLoading = false,
  ...rest
}: Props) {
  return (
    <Container type={type} enabled={!isLoading} {...rest}>
      {isLoading ? <Load /> : <Title>{title}</Title>}
    </Container>
  )
}
