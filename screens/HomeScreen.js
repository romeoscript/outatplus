import React, { useState, useEffect } from 'react';
import { View, Text, Platform, TouchableOpacity, TextInput, ScrollView, StyleSheet, Modal, FlatList, Animated, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Calendar } from 'react-native-calendars';
import { Bars3CenterLeftIcon, CalendarDaysIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import LiveAction from '../components/liveAction';
import { ActivityIndicator } from 'react-native';
import Popular from '../components/Popular';
import { Video } from 'expo-av'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const ios = Platform.OS === 'ios';

const HomeScreen = ({ navigation }) => {
  const [live, setLive] = useState([]);
  const [popular, setPopular] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState({});
  const [loading, setLoading] = useState(false);
  const [categorizedData, setCategorizedData] = useState({});
  const [videoUrl, setVideoUrl] = useState(''); // Add state for video URL
  const [videoModalVisible, setVideoModalVisible] = useState(false); 

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const playVideo = (url) => {
    setVideoUrl(url);
    setVideoModalVisible(true);
  };

  const fetchCalendarEvents = async () => {
    setLoading(true);
    const API_KEY = 'AIzaSyASNpFRidfmY0J1iqyhKeRhtrz4DVKhqqA';
    const CALENDAR_ID = 'c_abd9e23bb2f1eb3b26572df286cc2f7cd6e4fe912d1e028efac58404a858ac33@group.calendar.google.com';
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}`);
    
    const data = await response.json();
    const events = data.items.reduce((acc, event) => {
      const date = event.start.date || event.start.dateTime.split('T')[0];
      acc[date] = { marked: true, dotColor: 'blue' };
      return acc;
    }, {});
    setCalendarEvents(events);
    setLoading(false);
  };

  useEffect(() => {
    if (modalVisible) {
      fetchCalendarEvents();
    }
  }, [modalVisible]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to get data from AsyncStorage
        const cachedData = await AsyncStorage.getItem('live_and_popular_data');
        if (cachedData) {
          const data = JSON.parse(cachedData);
          processFetchedData(data);
          return;
        }
  
        // If no cached data, fetch from API
        const response = await fetch('https://c.streamhoster.com/feed/WGsdtX/qkBbga8sOu9/dnLjYgF2saD?format=rokujson');
        const data = await response.json();
  
        // Cache the fetched data in AsyncStorage
        await AsyncStorage.setItem('live_and_popular_data', JSON.stringify(data));
  
        processFetchedData(data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
  
    const processFetchedData = (data) => {
      const liveFeeds = data.liveFeeds.map(item => ({
        id: item.id,
        title: item.title,
        genre: 'Live',
        description: item.shortDescription,
        poster: item.thumbnail,
        videoUrl: item.content.videos[0].url,
        releaseDate: item.releaseDate,
        rating: 'N/A',
        similarMovies: [],
      }));
  
      const allItems = data.tvSpecials.map(item => ({
        id: item.id,
        title: item.title,
        genre: item.genres.join(', '),
        description: item.shortDescription,
        poster: item.thumbnail,
        videoUrl: item.content.videos[0].url,
        releaseDate: item.releaseDate,
        rating: 'N/A',
        similarMovies: data.tvSpecials,
        content: item.content,
      }));
  
      const categories = data.categories.map(category => category.name);
      // Categorize items dynamically and exclude empty categories
      const categorizedItems = categories.reduce((acc, category) => {
        const items = allItems.filter(item => item.title.includes(category));
        if (items.length > 0) {
          acc[category] = items;
        }
        return acc;
      }, {});
  
      setLive(liveFeeds);
      setPopular(allItems);
      setCategorizedData(categorizedItems);
      setFilteredResults(allItems);
    };
  
    fetchData();
  }, []);
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredResults(popular);
      return;
    }

    const filteredResults = popular.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredResults(filteredResults);
  }, [searchQuery, popular]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('movie', { item })}>
      <Image source={{ uri: item.poster }} style={styles.poster} />
      <Text style={{color:"white"}}>{item?.title.length > 15 ? `${item?.title.slice(0, 15)}...` : item?.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={ios ? styles.iosSafeArea : styles.androidSafeArea}>
        <StatusBar style="light" backgroundColor="#000" />
        <View style={styles.header}>
          <Text style={styles.title}>OutAtInc</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        {searchQuery.trim() ? (
          <FlatList
            data={filteredResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={3}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.contentContainer}
          />
        ) : (
          <>
            <LiveAction trending={live} onPlayVideo={playVideo} /> 
            {Object.keys(categorizedData).map(category => (
              <Popular key={category} title={category} data={categorizedData[category]} />
            ))}
          </>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.floatingButton} onPress={toggleModal}>
        <CalendarDaysIcon size={50} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Outat Calendar</Text>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Calendar
                style={styles.calendar}
                markedDates={calendarEvents}
                theme={{
                  backgroundColor: '#ffffff',
                  calendarBackground: '#ffffff',
                  textSectionTitleColor: '#b6c1cd',
                  selectedDayBackgroundColor: '#00adf5',
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: '#00adf5',
                  dayTextColor: '#2d4150',
                  textDisabledColor: '#d9e1e8',
                  dotColor: '#00adf5',
                  selectedDotColor: '#ffffff',
                  arrowColor: 'orange',
                  monthTextColor: 'blue',
                  indicatorColor: 'blue',
                  textDayFontFamily: 'monospace',
                  textMonthFontFamily: 'monospace',
                  textDayHeaderFontFamily: 'monospace',
                  textDayFontWeight: '300',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '300',
                  textDayFontSize: 16,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 16,
                }}
                onDayPress={(day) => {
                  console.log('selected day', day);
                }}
              />
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={videoModalVisible} animationType="slide" transparent>
        <View style={styles.fullscreenVideoContainer}>
          <Video
            source={{ uri: videoUrl }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            shouldPlay
            style={styles.fullscreenVideo}
          />
          <TouchableOpacity onPress={() => setVideoModalVisible(false)} style={styles.closeVideoButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreenVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
  },
  closeVideoButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 5,
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  iosSafeArea: {
    marginBottom: -2,
  },
  androidSafeArea: {
    marginBottom: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    flex: 1,
    marginLeft: 10,
    color: '#000',
  },
  scrollViewContent: {
    paddingBottom: 10,
    padding: 0
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  item: {
    flex: 1,
    margin: 5,
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  poster: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    backgroundColor: '#6B21A8',
    borderRadius: 50,
    padding: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#000',
  },
  calendar: {
    marginTop: 20,
  },
});

export default HomeScreen;
