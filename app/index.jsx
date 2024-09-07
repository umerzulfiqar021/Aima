import { StatusBar } from 'expo-status-bar';
import { Text, View,SafeAreaView } from 'react-native';
import { Link } from 'expo-router';

export default function App() {
  return (
    
    <View  className="flex-1 items-center justify-center">
      <Text className="text-black-500">Auraooooaoao</Text>
      <StatusBar style="auto" />
      <Link href="/profile" style={{color:'blue'}}>go to Profile</Link>
    </View>
    
  );
}


