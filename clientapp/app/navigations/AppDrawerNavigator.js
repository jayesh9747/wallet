import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AppNavigator from './AppNavigator';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';

const Drawer = createDrawerNavigator();

function AppDrawerNavigator() {
  return (
    <>
      <Drawer.Navigator screenOptions={{ headerShown: false }} >
        <Drawer.Screen name="Home" component={AppNavigator} />
        <Drawer.Screen name="History" component={TransactionHistoryScreen} />
      </Drawer.Navigator>
    </>
  );
}

export default AppDrawerNavigator;
