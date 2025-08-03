// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContactDetail from '../screen/contactDetail';
import AddContact from '../screen/addContact';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ContactDetail"
        component={ContactDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddContact"
        component={AddContact}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function Root() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
