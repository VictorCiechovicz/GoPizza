//este componente vai ser apresentado no comeco da aplicao antes do carregamento total.

import { View } from 'react-native'
import LottieView from 'lottie-react-native'

export function Loading() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
      }}
    >
      <LottieView
        source={require('../../assets/Loadingpizza.json')}
        autoPlay
        loop
        style={{ width: 300 }}
      />
    </View>
  )
}
