import { useState } from 'react';
import { View, Text, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../components/FormField';
import CustomButton from '../components/CustomButton';
import { Link, router } from 'expo-router';
import { getCurrentUser, signIn } from '../../libb/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;  // Exit early to prevent further execution
    }
    setIsSubmitting(true);
    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);
      router.replace('/home');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className={'bg-primary h-full'}>
      <ScrollView>
        <View className={'w-full justify-center min-h-[83vh] px-4 my-6'}>
          <Image source={images.logo}
            resizeMode='contain'
            className={'w-[150px] h-[135px]'}
          />
          <Text className={'text-2xl text-white text-semibold mt-10 font-psemibold'}>
            Log in to <Text className='text-secondary-200'>PostPlay</Text>
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles='mt-7'
            keyboardType="email-address"
          />
          <FormField
            title='Password'
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles='mt-7'
          />

          <CustomButton
            title={'Sign In'}
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          {/* Show Activity Indicator when submitting */}
          {isSubmitting && (
            <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
          )}

          <View className={'justify-center pt-5 flex-row gap-2'}>
            <Text className={'text-lg text-gray-100 font-pregular'}>
              Don't have an account?
            </Text>
            <Link href='sign-up' className='text-lg font-psemibold text-secondary'>
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SignIn;
