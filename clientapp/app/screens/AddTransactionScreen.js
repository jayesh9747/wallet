import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import * as Yup from 'yup';
import LottieView from 'lottie-react-native';
import { AppForm, AppFormField, SubmitButton, ErrorMessage } from '../components/forms';
import Screen from '../components/Screen';
import color from '../config/color';
import transactionAPI from '../apis/transaction';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';

const validationSchema = Yup.object().shape({
    amount: Yup.number().required('Amount is required').min(1, 'Amount must be greater than 0').label('Amount'),
    description: Yup.string().label('Description'),
    type: Yup.string().required('Transaction type is required').oneOf(['SEND', 'RECEIVE']).label('Type'),
    category: Yup.string()
        .required('Category is required')
        .oneOf(['SAVINGS', 'FOOD', 'SALARY', 'ENTERTAINMENT', 'UTILITIES', 'OTHERS'])
        .label('Category'),
});

const AddTransactionScreen = ({ navigation }) => {
    const [submitFailed, setSubmitFailed] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setSubmitFailed(false);
            console.log('Submitting transaction:', values);
            const response = await transactionAPI.addTransaction(values);
            console.log('API Response:', response.data);

            if (response?.data?.success) {
                // Show success animation
                setShowSuccessModal(true);
                setTimeout(() => {
                    setShowSuccessModal(false);
                    navigation.navigate('Home'); // Navigate to home screen
                }, 2000); // Duration for showing animation
            } else {
                throw new Error(response?.data?.message || 'Failed to add transaction');
            }
        } catch (error) {
            console.error('Error while submitting transaction:', error);
            setSubmitFailed(true);
            setErrMsg(error?.message || 'An unexpected error occurred');
        }
    };

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>
                        <AppForm
                            initialValues={{
                                amount: '',
                                type: '',
                                category: '',
                                description: '',
                                invoiceImage: '',
                            }}
                            onSubmit={handleSubmit}
                            validationSchema={validationSchema}
                        >
                            {submitFailed && <ErrorMessage visible={true} error={errMsg} />}

                            <AppFormField title="Invoice Image" name="invoiceImage" type="image" />
                            <AppFormField
                                title="Amount"
                                name="amount"
                                placeholder="Enter Amount"
                                keyboardType="numeric"
                            />
                            <AppFormField
                                title="Type"
                                name="type"
                                placeholder="Transaction Type"
                                type="dropdown"
                                items={[
                                    { label: 'Send', value: 'SEND' },
                                    { label: 'Receive', value: 'RECEIVE' },
                                ]}
                            />
                            <AppFormField
                                title="Category"
                                name="category"
                                placeholder="Enter Category"
                                type="dropdown"
                                items={[
                                    { label: 'Savings', value: 'SAVINGS' },
                                    { label: 'Food', value: 'FOOD' },
                                    { label: 'Salary', value: 'SALARY' },
                                    { label: 'Entertainment', value: 'ENTERTAINMENT' },
                                    { label: 'Utilities', value: 'UTILITIES' },
                                    { label: 'Others', value: 'OTHERS' },
                                ]}
                            />
                            <AppFormField
                                title="Description"
                                name="description"
                                placeholder="Enter Description"
                            />

                            <SubmitButton title="Add Transaction" />
                        </AppForm>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Success Modal */}
            <Modal transparent visible={showSuccessModal} animationType="fade">
                <View style={styles.modalContainer}>
                    <LottieView
                        source={require('../assets/animations/success.json')}
                        autoPlay
                        loop={false}
                        style={styles.lottie}
                    />
                    <Text style={styles.successText}>Transaction Added Successfully!</Text>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: color.light,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    lottie: {
        width: 200,
        height: 200,
    },
    successText: {
        marginTop: 20,
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default AddTransactionScreen;
