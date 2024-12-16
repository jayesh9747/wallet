import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';

import HomeNavigator from './HomeNavigator';
import AccountNavigator from './AccountNavigator';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';

const Tab = createBottomTabNavigator();

const DrawerButton = ({ navigation }) => (
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <MaterialCommunityIcons style={{ paddingLeft: 20, marginTop: 2 }} name="menu" size={24} />
    </TouchableOpacity>
);

function AppNavigator({ navigation }) {
    return (
        <Tab.Navigator initialRouteName='HomeScreen'>

            <Tab.Screen
                name="History"
                component={TransactionHistoryScreen}
                options={{
                    tabBarIcon: ({ size, color }) => <MaterialCommunityIcons name="history" size={size} color={color} />,
                    title: 'History',
                    headerTitleAlign: 'center',
                    headerShown: true,
                }}
            />

            <Tab.Screen
                name="HomeScreen"
                component={HomeNavigator}
                options={{
                    tabBarIcon: ({ size, color }) => <MaterialCommunityIcons name="home" size={size} color={color} />,
                    title: 'Home',
                    headerLeft: () => <DrawerButton navigation={navigation} />,
                    headerShown: true,
                }}
            />

            <Tab.Screen
                name="Account"
                component={AccountNavigator}
                options={{
                    tabBarIcon: ({ size, color }) => <MaterialCommunityIcons name="account" size={size} color={color} />,
                    title: 'Account',
                    headerTitleAlign: 'center',
                    headerShown: true,
                }}
            />

        </Tab.Navigator>
    );
}

export default AppNavigator;
