import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { Images } from '../constant/images';

const AddProduct = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      userDetails();
    }
  }, [isFocused]);

  const userDetails = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('useContactData');
      const data = JSON.parse(jsonValue) || [];
      setUserInfo(data);
    } catch (e) {
      console.log('Error fetching user details:', e);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.contactCard}>
        <Image source={{ uri: item.userImage }} style={styles.avatar} />
        <View style={styles.contactInfo}>
          <Text style={styles.companyText}>
            {item.companyName || 'No Company'}
          </Text>
          <Text style={styles.nameText}>{item.firstName || 'Unnamed'}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            alert('Added to list');
          }}
        >
          <Image source={Images.like} style={styles.likeImage} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <Text style={styles.headerText}>Add Contact</Text>
      </View>

      <FlatList
        data={userInfo}
        renderItem={renderItem}
        keyExtractor={(_, i) => `item${i + 1}`}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('FormScreen')}
      >
        <Text style={styles.fabText}>＋</Text>
      </Pressable>
    </View>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },

  headerView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  headerText: { fontSize: 22, fontWeight: '700', color: '#2c3e50' },

  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#dfe6e9',
  },
  contactInfo: { flex: 1, marginHorizontal: 12 },
  companyText: { fontSize: 16, fontWeight: '600', color: '#34495e' },
  nameText: { fontSize: 14, color: '#7f8c8d', marginTop: 2 },

  likeImage: { height: 24, width: 24, tintColor: '#e74c3c' },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#3498db',
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: { color: 'white', fontSize: 30, lineHeight: 30 },
});
