import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../components/FormField'
const Create = () => {
  const [uploading,setUploading] = useState (false);
  const [form,setForm] = useState ({
    title : '',
    video : null,
    thumbnail : null,
    prompt : ''
  })
  return (
    <SafeAreaView className = 'bg-primary h-full'>
<ScrollView className = 'px-4 my-6'>
  <Text className = 'text-2xl text-white font-psemibold'>
    Upload Video
  </Text>
    <FormField
    title = 'Video Title'
    value={form.title}
    placeholder={'Title'}
    handleChangeText={(e)=> setForm({...form,
      title : e  
    })}
    otherStyles={'mt-10'}
    />
  <View className = 'mt-7 space-y-2 '>
    <Text className = 'text-base text-gray-100 font-pmedium  '>
    Upload Video
    </Text>

  </View>
</ScrollView>
    </SafeAreaView>
  )
}

export default Create