// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC6qaJk0Eb8jtSNUynKYGPSjfiPj2Mwf9o",
    authDomain: "queieing.firebaseapp.com",
    databaseURL: "https://queieing-default-rtdb.firebaseio.com",
    projectId: "queieing",
    storageBucket: "queieing.appspot.com",
    messagingSenderId: "257619042814",
    appId: "1:257619042814:web:7fa6bb5324b1c3b47720af"
};

// Ensure Firebase is only initialized once
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // Use the default app if already initialized
}

const db = firebase.database();
const staffQueueRef = db.ref('queue');
const transactionsRef = db.ref('transactions');

// Track queue updates
staffQueueRef.on('value', (snapshot) => {
    const staffQueue = document.getElementById('staffQueue');
    staffQueue.innerHTML = "";  // Clear the previous queue

    if (snapshot.exists()) {
        snapshot.forEach(childSnapshot => {
            const client = childSnapshot.val();
            const barber = client.barber || "Any barber";  // Default to "Any barber" if barber is empty
            staffQueue.innerHTML += `
                <p>
                    <strong>${client.name}</strong> - ${client.phone} - Preferred Barber: ${barber}
                    <input type="number" id="amount-${childSnapshot.key}" placeholder="Amount Received">
                    <button onclick="serveClient('${childSnapshot.key}')">Serve & Remove</button>
                </p>
            `;
        });
    } else {
        staffQueue.innerHTML = "<p>No clients in queue</p>";
    }
});

// Serve & remove client, record transactions
function serveClient(clientId) {
    const amountReceived = document.getElementById(`amount-${clientId}`).value.trim();

    // Validate input for amount
    if (amountReceived === "" || isNaN(amountReceived) || parseFloat(amountReceived) <= 0) {
        alert("Please enter a valid amount received before removing the client.");
        return;
    }

    db.ref('queue/' + clientId).once('value').then(snapshot => {
        const clientData = snapshot.val();
        if (clientData) {
            db.ref('transactions/' + clientId).set({
                name: clientData.name,
                phone: clientData.phone,
                barber: clientData.barber || "Any barber",  // Add barber to the transaction data, default to "Any barber"
                amount: parseFloat(amountReceived),
                date: new Date().toLocaleString()
            });

            // Remove client from queue
            db.ref('queue/' + clientId).remove()
                .then(() => {
                    console.log(`Client ${clientId} removed from queue`);
                })
                .catch(err => console.error('Error removing client:', err));
        }
    });
}

// Export transactions to CSV
function exportToCSV() {
    transactionsRef.once('value').then(snapshot => {
        let csvContent = "data:text/csv;charset=utf-8,Name,Phone,Barber,Amount,Date\n";

        snapshot.forEach(childSnapshot => {
            const data = childSnapshot.val();
            csvContent += `${data.name},${data.phone},${data.barber || "Any barber"},${data.amount},${data.date}\n`; // Default barber to "Any barber" if empty
        });

        // Create a download link for the CSV file
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
    }).catch(err => console.error('Error exporting transactions:', err));
}
