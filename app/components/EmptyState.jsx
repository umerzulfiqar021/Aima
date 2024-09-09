import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '../../constants'
const EmptyState = () => {
  return (
    <View className = {'justify-center items-center px-4'}>
     <Image
     source={images.empty}
     className = {'w-[270px] h-[215px] '}
     resizeMode='contain'
     />
    </View>
  )
}

export default EmptyState