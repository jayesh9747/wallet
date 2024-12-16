import React, { useState, useEffect, useContext } from 'react';
import ListItem from '../components/ListItem';
import { StyleSheet, View, FlatList, Text, Alert, ActivityIndicator } from 'react-native';
import colors from '../config/color';
import Icon from '../components/Icon';
import ListItemSeparator from '../components/ListItemSeparator';
import authStore from '../auth/authStore';
import AuthContext from '../auth/context';
import routes from '../navigations/routes';
import useProfileStore from '../hooks/useUserStore';
import AuthApi from '../apis/AuthApi';

const menuItems = [
    {
        title: 'My Transactions',
        icons: {
            name: 'format-list-bulleted',
            backgroundColor: colors.primary,
        },
        targetScreen: routes.History,
    },
    {
        title: 'Contact Us',
        icons: {
            name: 'email',
            backgroundColor: colors.secondary,
        },
        onPress: () =>
            Alert.alert(
                'Contact Us',
                'Visit our website: https://transpectra.com\nHelpline: 7490811091',
                [{ text: 'OK' }],
                { cancelable: true }
            ),
    },
];

const AccountScreen = ({ navigation }) => {

    const { setToken } = useContext(AuthContext);
    const user = useProfileStore((state) => state.user);
    const setUserProfile = useProfileStore((state) => state.setUserProfile);
    const clearUserProfile = useProfileStore((state) => state.clearUserProfile);


    const logout = async () => {
        try {
            await authStore.removeToken();
            await clearUserProfile();
            setToken(null);
        } catch (error) {
            Alert.alert('Error', 'Logout failed. Please try again.');
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', onPress: logout },
            ],
            { cancelable: false }
        );
    };

    return (
        <>
            <View style={styles.container}>
                <ListItem
                    title={user.fullName || 'Guest User'}
                    subtitle={user.email || 'guest@example.com'}
                    image={require('../assets/user.png')}
                />
            </View>
            <View>
                <FlatList
                    data={menuItems}
                    keyExtractor={(menuItem) => menuItem.title}
                    ItemSeparatorComponent={ListItemSeparator}
                    renderItem={({ item }) => (
                        <ListItem
                            title={item.title}
                            IconComponent={
                                <Icon
                                    name={item.icons.name}
                                    backgroundColor={item.icons.backgroundColor}
                                />
                            }
                            onPress={
                                item.targetScreen
                                    ? () => navigation.navigate(item.targetScreen)
                                    : item.onPress
                            }
                        />
                    )}
                />
            </View>
            <ListItem
                title="Log Out"
                IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
                onPress={handleLogout}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1 / 4,
    },
    screen: {
        backgroundColor: colors.light,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AccountScreen;
