import apiClient from "./apiclient";

// Add a new transaction
const addTransaction = ({ amount, type, category, description, invoiceImage }) => {
    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('type', type);
    formData.append('category', category.toUpperCase());
    formData.append('description', description);
    if (invoiceImage) {
        formData.append('InvoiceImage', {
            uri: invoiceImage, // Use the URI from the image picker
            name: 'invoice.jpg', // Assign a name (you can customize or extract it)
            type: 'image/jpeg', // Ensure correct MIME type
        });
    }

    console.log("this is form data", formData);

    return apiClient.post('/transactions/add', formData), {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };
};

// Fetch transaction history
const fetchTransactionHistory = ({ category, startDate, endDate } = {}) => {
    const params = new URLSearchParams();

    if (category) params.append('category', category);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    return apiClient.get(`/transactions/history?${params.toString()}`);
};

// Fetch wallet details
const fetchWalletDetails = () => {
    return apiClient.get('/wallet');
};

export default {
    addTransaction,
    fetchTransactionHistory,
    fetchWalletDetails,
};