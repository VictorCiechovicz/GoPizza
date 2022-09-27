import React, { useState } from 'react'
import { TouchableOpacity, ScrollView, Alert } from 'react-native'
import { ButtonBack } from '@components/ButtonBack'
import { Photo } from '@components/Photo'
import { Input } from '@components/Input'
import { InputPrice } from '@components/InputPrice'
import { Button } from '@components/Button'

import {
  Container,
  Header,
  Title,
  DeleteLabel,
  Upload,
  PickImageButton,
  Label,
  InputGroup,
  InputGroupHeader,
  MaxCharacteres,
  Form
} from './styled'

import * as ImagePicker from 'expo-image-picker'

import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'

export function Products() {
  const [image, setImage] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [priceSizeP, setPriceSizeP] = useState('')
  const [priceSizeM, setPriceSizeM] = useState('')
  const [priceSizeG, setPriceSizeG] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  //função chama que pede a autorização do usuario para acessar biblioteca de fotos do dispositivo e depois puxa a imagem e armazana a uri.
  async function handlePickerImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4]
      })
      if (!result.cancelled) {
        setImage(result.uri)
      }
    }
  }

  //Função para adionar os dados no firebase
  //O .trim() sreve para não deixar que o usuario de um espaço e tente cadastrar uma pizza sem informar todos os campos.
  async function handleAdd() {
    if (!name.trim()) {
      Alert.alert('Cadastro', 'Informe o nome da pizza.')
    }

    if (!description.trim()) {
      Alert.alert('Cadastro', 'Informe a descrição da pizza.')
    }

    if (!image) {
      Alert.alert('Cadastro', 'Selecionae uma imagem da pizza.')
    }

    if (!priceSizeP || !priceSizeM || !priceSizeG) {
      Alert.alert('Cadastro', 'Informe o preço de todos os tamanhos da pizza.')
    }
    setIsLoading(true)

  
    const fileName = new Date().getTime()
    //const salva na storage na pasta de pizzas que foi criada la
    const reference = storage().ref(`/pizzas/${fileName}.png`)

    await reference.putFile(image)
    //constante que vai la no storage e pega a URL da imagem usando a reference
    const photo_url = await reference.getDownloadURL()

    //Agora vamos enviar todos dados para o Firestore
    firestore()
      .collection('pizzas')
      .add({
        name,
        //aqui em baixo vamos enviar o nome da pizza todo em minusclo em um variavel para depois fazermos uma campo de busca, fica mais facil assim.
        name_insensitive: name.toLowerCase().trim(),
        description,
        preces_sizes: {
          p: priceSizeP,
          m: priceSizeM,
          g: priceSizeG
        },
        photo_url,
        //aqui vamos salvar o caminho de pastas aonde a imagem esta salva
        photo_path: reference.fullPath
      })
      .then(()=> Alert.alert('Cadastro', 'Pizza cadastrada com sucesso.'))
      .catch(()=> Alert.alert('Cadastro', 'não foi possível cadastrar a pizza.'))
    
  }

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <ButtonBack />
          <Title>Cadastrar</Title>
          <TouchableOpacity>
            <DeleteLabel>Deletar</DeleteLabel>
          </TouchableOpacity>
        </Header>
        <Upload>
          <Photo uri={image} />
          <PickImageButton
            title="Carregar"
            type="secondary"
            onPress={handlePickerImage}
          />
        </Upload>
        <Form>
          <InputGroup>
            <Label>Nome</Label>
            <Input onChangeText={setName} value={name} />
          </InputGroup>
          <InputGroupHeader>
            <Label>Descrição</Label>
            <MaxCharacteres>0 de 60 Caracteres</MaxCharacteres>
          </InputGroupHeader>
          <InputGroup>
            <Input
              multiline
              maxLength={60}
              style={{ height: 80 }}
              onChangeText={setDescription}
              value={description}
            />
          </InputGroup>

          <InputGroup>
            <Label>Tamanhos e Preços</Label>
            <InputPrice
              size="P"
              onChangeText={setPriceSizeP}
              value={priceSizeP}
            />
            <InputPrice
              size="M"
              onChangeText={setPriceSizeM}
              value={priceSizeM}
            />
            <InputPrice
              size="G"
              onChangeText={setPriceSizeG}
              value={priceSizeG}
            />
          </InputGroup>

          <Button
            title="Cadastrar pizza"
            isLoading={setIsLoading}
            onPress={handleAdd}
          />
        </Form>
      </ScrollView>
    </Container>
  )
}
