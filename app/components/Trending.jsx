import { View, Text, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native'
import React from 'react'
import { useState } from 'react'
import * as Animatable from 'react-native-animatable'
import { icons } from '../../constants';

const zoomIn = {
  0:{
    scale:0.9
  },
  1: {
    scale:1,
  },
};
const zoomOut = {
  0:{
    scale:1
  },
  1: {
    scale:0.9,
  },
};
const TrendingItem = ({activeItem,item}) => {
  const [play,setPlay] = useState(false);
  return(
    <Animatable.View
    className = 'mr-5'
    animation={activeItem === item.$id ? zoomIn: zoomOut}
    duration={500}
    >
      {play ? (
        <Text className = 'text-white'>Playing</Text>
      ) : (
        <TouchableOpacity className = 'relative justify-center items-center' activeOpacity={0.7}
        onPress={()=>setPlay(true)}
        >
          <ImageBackground
          source={{
            uri:item.thumbnail,
          }}
          className = 'w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40'
          />
          <Image
          source = {icons.play}
          />
          </TouchableOpacity>
      )}
    </Animatable.View>
  )
}
const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts.length > 0 ? posts[0] : null);

  if (!posts || posts.length === 0) {
    return <Text>No posts available</Text>;
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem
          activeItem={activeItem}
          item={item}
        />
      )}
      horizontal
    />
  );
};


export default Trending