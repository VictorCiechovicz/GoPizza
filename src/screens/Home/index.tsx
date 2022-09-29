import React, { useEffect, useState } from 'react'
import { Alert, TouchableOpacity, FlatList } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useTheme } from 'styled-components'
import happyEmoji from '@assets/happy.png'
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'

import { Search } from '@components/Search'
import { ProductCard, ProductProps } from '@components/ProductCard'

import {
  Container,
  Header,
  Greeting,
  GreetingEmoji,
  GreetingText,
  MenuHeader,
  MenuItemNumber,
  Title
} from './style'

export function Home() {
  const { COLORS } = useTheme()
  const [pizzas, setPizzas] = useState<ProductProps[]>([])
  const [search, setSearch] = useState('')
  const navigation = useNavigation()

  //funcao que busca uma pizza atraves do nome digitado no search
  function fetchPizzas(value: string) {
    const formattedValue = value.toLocaleLowerCase().trim()

    firestore()
      .collection('pizzas')
      .orderBy('name_insensitive')
      .startAt(formattedValue)
      .endAt(`${formattedValue}\uf8ff`)
      .get()
      .then(response => {
        const data = response.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          }
        }) as ProductProps[]

        setPizzas(data)
      })
      .catch(() =>
        Alert.alert('Consulta', 'Nao foi possivel realizar a consulta.')
      )
  }
  //funcao de busca
  function handleSearch() {
    fetchPizzas(search)
  }

  //funcao de limpeza
  function handleSearchClear() {
    setSearch('')
    fetchPizzas('')
  }

  function handleOpen(id: string) {
navigation.navigate('Product',{id})

  }

  // esse useeffect tras todas as pizzas cadastradas
  useEffect(() => {
    fetchPizzas('')
  }, [])

  return (
    <Container>
      <Header>
        <Greeting>
          <GreetingEmoji source={happyEmoji} />
          <GreetingText>Olá,Admin</GreetingText>
        </Greeting>

        <TouchableOpacity>
          <MaterialIcons name="logout" color={COLORS.TITLE} size={24} />
        </TouchableOpacity>
      </Header>
      <Search
        onChangeText={setSearch}
        value={search}
        onSearch={handleSearch}
        onClear={handleSearchClear}
      />

      <MenuHeader>
        <Title>Cardápio</Title>
        <MenuItemNumber>10 pizzas</MenuItemNumber>
      </MenuHeader>

      <FlatList
        data={pizzas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductCard data={item} onPress={() => handleOpen(item.id)} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 125,
          marginHorizontal: 24
        }}
      />
    </Container>
  )
}