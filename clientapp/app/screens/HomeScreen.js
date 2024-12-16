import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import AddTransactionScreen from './AddTransactionScreen';
import useProfileStore from '../hooks/useUserStore';
const screenWidth = Dimensions.get('window').width;
import transactionAPI from '../apis/transaction';

const HomeScreen = ({ navigation }) => {
    const user = useProfileStore((state) => state.user);
    const [walletData, setWalletData] = useState(null);
    const [transactionData, setTransactionData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await transactionAPI.fetchWalletDetails();
                const { wallet, transaction } = response.data.data;
                setWalletData(wallet);
                setTransactionData(transaction);
                console.log(transactionData)
            } catch (error) {
                console.error('Error fetching wallet data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const pieData = transactionData.reduce((acc, transaction) => {
        const existingCategory = acc.find((item) => item.name === transaction.category);
        if (existingCategory) {
            existingCategory.amount += transaction.amount;
        } else {
            acc.push({
                name: transaction.category,
                amount: transaction.amount,
                color: getRandomColor(),
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
            });
        }
        return acc;
    }, []);


    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#FF6384" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <View style={styles.textContainer}>
                        <Text style={styles.headerText}>Welcome back</Text>
                        <Text style={styles.userName}>{user.fullName}</Text>
                    </View>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/50' }}
                        style={styles.userImage}
                    />
                </View>

                <View style={styles.expenseContainer}>
                    <Text style={styles.sectionTitle}>Manage your expenses</Text>
                    <Text style={styles.totalExpense}>₹{walletData?.balance}</Text>

                    <PieChart
                        data={pieData.map(item => ({
                            name: item.name,
                            population: item.amount,
                            color: item.color,
                            legendFontColor: item.legendFontColor,
                            legendFontSize: item.legendFontSize
                        }))}
                        width={screenWidth - 80}
                        height={220}
                        chartConfig={chartConfig}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                    />

                    <View style={styles.dateRangeContainer}>
                        <Text style={styles.dateRangeText}>1 Feb 2023 - 28 Feb 2023</Text>
                    </View>
                </View>

                <View style={styles.summaryContainer}>
                    <View style={styles.incomeCard}>
                        <Text style={styles.incomeText}>Income</Text>
                        <Text style={styles.incomeAmount}>+{walletData.totalIncoming}</Text>
                    </View>
                    <View style={styles.expenseCard}>
                        <Text style={styles.expenseText}>Expenses</Text>
                        <Text style={styles.expenseAmount}>-{walletData.totalOutgoing}</Text>
                    </View>
                </View>

                <View style={styles.planContainer}>
                    <Text style={styles.planText}>Your expense plan looks good</Text>
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddTransaction')}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};



const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    headerText: {
        fontSize: 16,
        color: '#888',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    expenseContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    totalExpense: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FF6384',
        marginBottom: 20,
    },
    dateRangeContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    dateRangeText: {
        fontSize: 14,
        color: '#7F7F7F',
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    incomeCard: {
        flex: 1,
        backgroundColor: '#E8F5E9',
        borderRadius: 10,
        alignItems: 'center',
        padding: 15,
        marginRight: 10,
    },
    incomeText: {
        fontSize: 14,
        color: '#388E3C',
    },
    incomeAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#388E3C',
    },
    expenseCard: {
        flex: 1,
        backgroundColor: '#FFEBEE',
        borderRadius: 10,
        alignItems: 'center',
        padding: 15,
        marginLeft: 10,
    },
    expenseText: {
        fontSize: 14,
        color: '#D32F2F',
    },
    expenseAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D32F2F',
    },
    planContainer: {
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#FFF9C4',
        borderRadius: 10,
    },
    planText: {
        fontSize: 14,
        color: '#FBC02D',
        fontWeight: 'bold',
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#FF6384',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});

export default HomeScreen;
