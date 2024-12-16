import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Alert, Image, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import transactionAPI from '../apis/transaction';
import routes from '../navigations/routes';
import TransactionItem from '../components/TransactionItem';

const TransactionHistoryScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [transactions, setTransactions] = useState([]);

    // Fetch transaction history from API
    const fetchTransactionHistory = async () => {
        setRefreshing(true);
        try {
            const response = await transactionAPI.fetchTransactionHistory();

            console.log(response.data);

            if (response?.data) {
                setTransactions(response.data.data);
            } else {
                setTransactions([]);
            }
        } catch (error) {
            console.error('Error fetching transaction history:', error);
            Alert.alert('Error', 'Failed to fetch transaction history. Please try again.');
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactionHistory();
    }, []);

    // Navigate to transaction details page
    const handleViewTransaction = (transaction) => {
        navigation.navigate(routes.TransactionDetails, { transaction });
    };

    const renderTransactionItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => handleViewTransaction(item)}>
            <View style={styles.deliveryContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.deliveryImage} />

                <View style={styles.deliveryDetails}>
                    <Text style={styles.deliveryTitle}>{item.category || 'Transaction'}</Text>
                    <Text style={styles.deliveryCategory}>Description: {item.description}</Text>
                    <Text style={styles.deliveryAmount}>Amount: ${item.amount}</Text>
                    <Text style={styles.deliveryDate}>Date: {new Date(item.date).toLocaleDateString()}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => handleViewTransaction(item)}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>View Details</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : transactions.length === 0 ? (
                <Text style={styles.emptyText}>No transactions found.</Text>
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    refreshing={refreshing}
                    onRefresh={fetchTransactionHistory}
                    renderItem={TransactionItem}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        color: '#777',
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    deliveryContainer: {
        flexDirection: 'row',
        margin: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    deliveryImage: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        marginRight: 10,
        borderRadius: 8,
    },
    deliveryDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    deliveryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    deliveryCategory: {
        fontSize: 14,
        color: '#777',
    },
    deliveryAmount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
    },
    deliveryDate: {
        fontSize: 12,
        color: '#555',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 5,
    },
    button: {
        padding: 5,
        backgroundColor: '#007bff',
        borderRadius: 3,
        width: '40%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
});

export default TransactionHistoryScreen;
