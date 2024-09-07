import { StatusBar } from 'expo-status-bar';
import { Text, View,SafeAreaView } from 'react-native';
import { Link } from 'expo-router';

export default function App() {
  return (
    
    <View  className="flex-1 items-center justify-center">
      <Text className="text-3xl font-pblack">Aura!</Text>
      <StatusBar style="auto" />
      <Link href="/home" style={{color:'blue'}}>GO to Home</Link>
    </View>
    
  );
}


