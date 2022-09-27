import React from 'react'
import { TouchableOpacity } from 'react-native'
import { ButtonBack } from '@components/ButtonBack'
import { Container, Header, Title, DeleteLabel } from './styled'

export function Products() {
  return (
    <Container>
      <Header>
        <ButtonBack/>
        <Title>Cadastrar</Title>
        <TouchableOpacity>
          <DeleteLabel>Deletar</DeleteLabel>
        </TouchableOpacity>
      </Header>
    </Container>
  )
}
