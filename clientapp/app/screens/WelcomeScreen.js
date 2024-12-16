import React from 'react'
import { Image, StyleSheet, View, Text } from 'react-native'

import AppButton from '../components/AppButton';
import routes from '../navigations/routes';
import AppText from '../components/AppText'

const WelcomeScreen = ({ navigation }) => {



    return (
        <View style={styles.backGround}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('../assets/logo.png')} />
                <AppText style={styles.text}>Transactly</AppText>
            </View>
            <View style={styles.buttonContainer}>
                <AppButton title={'Login'} onPress={() => navigation.navigate(routes.LOGIN)} />
                <AppButton title={'Register'} color='primary' onPress={() => navigation.navigate(routes.REGISTER)} />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    backGround: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    buttonContainer: {
        padding: 20,
        width: '100%'
    },
    logo: {
        width: 350,
        height: 200,
        resizeMode: "contain"
    },
    logoContainer: {
        position: 'absolute',
        top: 250,
        alignItems: 'center',
        padding: 20
    },
    text: {
        textAlign: "center",
        fontSize: 50,
        fontWeight: '400'
    }

})

export default WelcomeScreen;