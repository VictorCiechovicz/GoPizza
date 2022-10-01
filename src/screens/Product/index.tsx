import React, { useState, useEffect } from 'react'
import { TouchableOpacity, ScrollView, Alert, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { useNavigation, useRoute } from '@react-navigation/native'

import { ProductNavigationProps } from '@src/@types/navigation'

import { ButtonBack } from '@components/ButtonBack'
import { Photo } from '@components/Photo'
import { Input } from '@components/Input'
import { InputPrice } from '@components/InputPrice'
import { Button } from '@components/Button'
import { ProductProps } from '@components/ProductCard'

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
} from './style'

type PizzaResponse = ProductProps & {
  photo_path: string
  prices_sizes: {
    p: string
    m: string
    g: string
  }
}

export function Products() {
  const [image, setImage] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [priceSizeP, setPriceSizeP] = useState('')
  const [priceSizeM, setPriceSizeM] = useState('')
  const [priceSizeG, setPriceSizeG] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [photoPath, setPhotoPath] = useState('')

  const navigation = useNavigation()

  //esse useroute faz com que possamos acessar o id atraves da rota
  const route = useRoute()
  const { id } = route.params as ProductNavigationProps

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
    if (
      !name.trim() ||
      !description.trim() ||
      !image ||
      !priceSizeP ||
      !priceSizeM ||
      !priceSizeG
    ) {
      Alert.alert(
        'Cadastro',
        'Informe todos os dados para o cadastro da pizza.'
      )
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
        prices_sizes: {
          p: priceSizeP,
          m: priceSizeM,
          g: priceSizeG
        },
        photo_url,
        //aqui vamos salvar o caminho de pastas aonde a imagem esta salva
        photo_path: reference.fullPath
      })
      .then(() => navigation.navigate('Home'))
      .catch(() => {
        setIsLoading(false)
        Alert.alert('Cadastro', 'Não foi possível cadastrar a pizza.')
      })
  }

  function handleGoBack() {
    navigation.goBack()
  }

  //funcao para deletar um item
  function handleDelete() {
    firestore()
      .collection('pizzas')
      .doc(id)
      .delete()
      .then(() => {
        storage()
          .ref(photoPath)
          .delete()
          .then(() => navigation.navigate('Home'))
      })
  }

  //esse useeffect puxa o card de pizza atraves do id passado pela rota
  useEffect(() => {
    if (id) {
      firestore()
        .collection('pizzas')
        .doc(id)
        .get()
        .then(response => {
          const product = response.data() as PizzaResponse

          setName(product.name)
          setDescription(product.description)
          setImage(product.photo_url)
          setPriceSizeP(product.prices_sizes.p)
          setPriceSizeM(product.prices_sizes.m)
          setPriceSizeG(product.prices_sizes.g)
          setPhotoPath(product.photo_path)
        })
    }
  }, [id])

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <ButtonBack onPress={handleGoBack} />
          <Title>Cadastrar</Title>
          {
            //neste caso abaixo temoso botao de deletar a pizza cadastrada esse botao so vai aparecer se o item possuir um id
            id ? (
              <TouchableOpacity onPress={handleDelete}>
                <DeleteLabel>Deletar</DeleteLabel>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 20 }} />
            )
          }
        </Header>
        <Upload>
          <Photo uri={image} />

          {
            //neste caso estamos envolvendo os botoes de modificacao de cada pizza cadastrada pelo admin
            !id && (
              <PickImageButton
                title="Carregar"
                type="secondary"
                onPress={handlePickerImage}
              />
            )
          }
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

          {!id && (
            <Button
              title="Cadastrar Pizza"
              isLoading={isLoading}
              onPress={handleAdd}
            />
          )}
        </Form>
      </ScrollView>
    </Container>
  )
}
