import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Images } from '../constant/images';

const ContactDetail = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [userData, setUserData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setSelectedImage('https://cdn-icons-png.flaticon.com/128/148/148764.png');
    getDataFromAsync();
  }, []);

  const getDataFromAsync = async () => {
    const jsonValue = await AsyncStorage.getItem('useContactData');
    const data = JSON.parse(jsonValue);
    if (jsonValue) setUserData(data);
  };

  const seletedImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setSelectedImage(
        image.path || 'https://cdn-icons-png.flaticon.com/128/148/148764.png',
      );
    });
  };

  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(mobileNumber)) {
      newErrors.mobileNumber = 'Enter a valid 10-digit number';
    }
    if (email && !emailRegex.test(email)) {
      newErrors.email = 'Enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onPressSave = async () => {
    if (!validateForm()) return;

    let data = {
      firstName,
      lastName,
      mobileNumber,
      companyName,
      email,
      userImage: selectedImage,
    };

    userData.push(data);
    await AsyncStorage.setItem('useContactData', JSON.stringify(userData));

    // Reset fields
    setFirstName('');
    setLastName('');
    setCompanyName('');
    setMobileNumber('');
    setEmail('');
    setPhone1('');
    setPhone2('');
    setSelectedImage('');

    navigation.navigate('AddContact');
  };

  return (
    <KeyboardAvoidingScrollView>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.navigate('AddContact')}>
            <Text style={[styles.headerText, { color: '#e74c3c' }]}>
              Cancel
            </Text>
          </Pressable>
          <Text style={styles.headerTitle}>Add Contact</Text>
          <Pressable onPress={onPressSave}>
            <Text style={[styles.headerText, { color: '#2ecc71' }]}>Save</Text>
          </Pressable>
        </View>

        {/* Profile Image */}
        <Pressable style={styles.avatarContainer} onPress={seletedImage}>
          <Image source={{ uri: selectedImage }} style={styles.avatar} />
          <View style={styles.editBadge}>
            <Text style={{ color: 'white', fontWeight: '700' }}>✎</Text>
          </View>
        </Pressable>

        {/* Input Fields */}
        <View style={styles.form}>
          <TextInput
            placeholder="First name *"
            style={[styles.input, errors.firstName && styles.inputError]}
            onChangeText={text => {
              setFirstName(text);
              setErrors({ ...errors, firstName: '' });
            }}
            value={firstName}
          />
          {errors.firstName && (
            <Text style={styles.errorText}>{errors.firstName}</Text>
          )}

          <TextInput
            placeholder="Last name"
            style={styles.input}
            onChangeText={setLastName}
            value={lastName}
          />

          <TextInput
            placeholder="Mobile number *"
            style={[styles.input, errors.mobileNumber && styles.inputError]}
            keyboardType="phone-pad"
            onChangeText={text => {
              setMobileNumber(text);
              setErrors({ ...errors, mobileNumber: '' });
            }}
            value={mobileNumber}
          />
          {errors.mobileNumber && (
            <Text style={styles.errorText}>{errors.mobileNumber}</Text>
          )}

          <TextInput
            placeholder="Company name"
            style={styles.input}
            onChangeText={setCompanyName}
            value={companyName}
          />

          <View style={styles.sectionDivider} />

          <View style={[styles.row, errors.email && styles.inputError]}>
            <Image source={Images.addImage} style={styles.icon} />
            <TextInput
              placeholder="Add Email"
              style={styles.inputFlex}
              keyboardType="email-address"
              onChangeText={text => {
                setEmail(text);
                setErrors({ ...errors, email: '' });
              }}
              value={email}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <View style={styles.row}>
            {/* <Image source={Images.addImage} style={styles.icon} /> */}
            <TextInput
              placeholder="Add Phone"
              style={styles.inputFlex}
              keyboardType="phone-pad"
              onChangeText={setPhone1}
              value={phone1}
            />
          </View>

          <View style={styles.row}>
            <Image source={Images.addImage} style={styles.icon} />
            <TextInput
              placeholder="Add Phone"
              style={styles.inputFlex}
              keyboardType="phone-pad"
              onChangeText={setPhone2}
              value={phone2}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingScrollView>
  );
};

export default ContactDetail;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: 'white',
    elevation: 3,
  },
  headerText: { fontSize: 18, fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#2c3e50' },
  avatarContainer: { alignSelf: 'center', marginVertical: 20 },
  avatar: {
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: '#ecf0f1',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3498db',
    borderRadius: 15,
    padding: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  form: { paddingHorizontal: 20 },
  input: {
    backgroundColor: 'white',
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    elevation: 1,
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 1,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 13,
    marginBottom: 5,
    marginLeft: 5,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginVertical: 8,
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 1,
  },
  icon: { height: 28, width: 28, marginRight: 10 },
  inputFlex: { flex: 1, paddingVertical: 10, fontSize: 16 },
});
