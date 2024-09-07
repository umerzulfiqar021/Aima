import { View, Text, ScrollView, Image} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants'
import FormField from '../components/FormField'

const SignIn = () => {
  const  [form,setForm] = useState ({
    email : '',
    password: ''
  })
  return (
   <SafeAreaView className = {'bg-primary h-full '}>
    <ScrollView>
      <View className = {' w-full justify-center  h-full px-4 my-6'} >
    <Image source={images.logo}
    resizeMode='contain'
    className = {'w-[115px] h-[35px]'}
    />
    <Text className = {'text-2xl text-white text-semibold mt-10 font-psemibold'}>
        Log in to Aora
        </Text>
        <FormField/>
      </View>
      
    </ScrollView>
   </SafeAreaView>
  )
}

export default SignIn