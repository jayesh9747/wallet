import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

const TransactionItem = ({ item }) => {
    // Determine amount color based on type
    const amountColor = item.type === 'RECEIVE' ? styles.amountReceive : styles.amountSend;

    // Format date to full string (e.g., 12 Nov, 5:30 PM)
    const formattedDate = new Date(item.date).toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    return (
        <View style={styles.transactionContainer}>
            {/* Transaction Image */}
            <Image source={{ uri: item.imageUrl }} style={styles.transactionImage} />

            {/* Transaction Details */}
            <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>
                    {item.description || 'Transaction'}
                </Text>
                <Text style={styles.transactionCategory}>
                    Category: {item.category || 'N/A'}
                </Text>
                <Text style={styles.transactionDate}>{formattedDate}</Text>

                {item.recurringInterval && item.recurringInterval !== 'NONE' && (
                    <Text style={styles.recurringInfo}>
                        Recurring: {item.recurringInterval}
                    </Text>
                )}
                {item.nextTransactionDate && (
                    <Text style={styles.nextTransactionDate}>
                        Next: {new Date(item.nextTransactionDate).toLocaleDateString()}
                    </Text>
                )}
            </View>

            <Text style={[styles.transactionAmount, amountColor]}>
                ${item.amount}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    transactionContainer: {
        flexDirection: 'row',
        marginVertical: 8,
        marginHorizontal: 10,
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        alignItems: 'center',
    },
    transactionImage: {
        width: 80, // Bigger Image
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    transactionDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    transactionCategory: {
        fontSize: 14,
        color: '#777',
    },
    transactionDate: {
        fontSize: 12,
        color: '#555',
    },
    recurringInfo: {
        fontSize: 12,
        color: '#007bff',
        marginTop: 5,
    },
    nextTransactionDate: {
        fontSize: 12,
        color: '#6c757d',
    },
    transactionAmount: {
        fontSize: 20, // Larger font for Amount
        fontWeight: 'bold',
    },
    amountReceive: {
        color: '#28a745',
    },
    amountSend: {
        color: '#dc3545',
    },
});

export default TransactionItem;
