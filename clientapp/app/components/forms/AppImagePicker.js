import React, { useState } from 'react';
import { View, Image, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AppText from '../AppText';
import color from '../../config/color';

const AppImagePicker = ({ imageUri, onImageSelect, disabled }) => {
    const [fileName, setFileName] = useState('');

    const handlePickImage = async () => {
        if (disabled) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets[0]?.uri) { // Ensure the result contains assets and uri
            const uriParts = result.assets[0].uri.split('/');
            const selectedFileName = uriParts[uriParts.length - 1];
            setFileName(selectedFileName);
            onImageSelect(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.imagePicker, disabled && styles.disabledPicker]}
                onPress={handlePickImage}
            >
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <AppText style={styles.placeholderText}>Tap to Pick an Image</AppText>
                )}
            </TouchableOpacity>
            <View style={styles.detailsContainer}>
                {fileName ? <AppText style={styles.fileName}>{fileName}</AppText> : null}
                {imageUri ? (
                    <Button
                        title="Change Image"
                        onPress={handlePickImage}
                        color={color.medium}
                        disabled={disabled}
                    />
                ) : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        padding: 10,
    },
    imagePicker: {
        width: 120,
        height: 120,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        overflow: 'hidden',
    },
    disabledPicker: {
        opacity: 0.6,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderText: {
        color: '#aaa',
        fontSize: 14,
        textAlign: 'center',
    },
    detailsContainer: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
    },
    fileName: {
        marginBottom: 10,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default AppImagePicker;
