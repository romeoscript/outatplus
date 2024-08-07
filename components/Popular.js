import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, View, Text, StyleSheet, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';

export default function Popular({ title, data, scrollX }) {
  const navigation = useNavigation();

  return (
    <View style={{marginVertical:20, paddingHorizontal:20}}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16 }}>
        <Text style={styles.text}>{title}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' , marginTop:16}}>
        {data.map((item, index) => (
          <TouchableWithoutFeedback onPress={() => navigation.navigate('movie', item)} key={index}>
            <View style={{ alignItems: 'center', width: 150 }}>
              <Image source={{ uri: item.poster }} style={{ width: 120, height: 180, borderRadius: 12 }} />
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{item.title.length>14?item.title.slice(0,14)+"...":item.title}</Text>
              {/* <Text style={{ color: 'white', fontSize: 12 }}>{item.description}</Text> */}
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});
