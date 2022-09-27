import React, { useState } from 'react'
//ess key faz com que quando o teclado for acionado o que estiver na tela suba junto.
import { KeyboardAvoidingView, Platform } from 'react-native'
import {
  Container,
  Content,
  Title,
  Brand,
  ForgotPasswordButton,
  ForgotPasswordLabel
} from './styles'

import { Input } from '@components/Input'
import { Button } from '@components/Button'

import brandImg from '@assets/brand.png'
import { useAuth } from '@hooks/auth'

export function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { singIn, isLoggin, forgotPassword } = useAuth()

  function handleSignIn() {
    singIn(email, password)
  }

  function handleForgotPassword() {
    forgotPassword(email)
  }

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Content>
          <Brand source={brandImg} />

          <Title>Login</Title>
          <Input
            placeholder="E-mail"
            type="secondary"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={setEmail}
          />
          <Input
            placeholder="Senha"
            type="secondary"
            secureTextEntry
            onChangeText={setPassword}
          />
          <ForgotPasswordButton onPress={handleForgotPassword}>
            <ForgotPasswordLabel>Esqueci minha senha</ForgotPasswordLabel>
          </ForgotPasswordButton>

          <Button
            title="Entrar"
            onPress={handleSignIn}
            type="secondary"
            isLoading={isLoggin}
          />
        </Content>
      </KeyboardAvoidingView>
    </Container>
  )
}
