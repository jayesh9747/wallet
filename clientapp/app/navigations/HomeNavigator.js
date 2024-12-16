
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';

import AddTransactionScreen from '../screens/AddTransactionScreen';

const Stack = createNativeStackNavigator();

function HomeNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
        </Stack.Navigator>
    );
}

export default HomeNavigator;
