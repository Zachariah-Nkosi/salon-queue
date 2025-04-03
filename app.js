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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Join Queue Button Click Event
document.getElementById('joinQueueBtn').addEventListener('click', () => {
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const barber = document.getElementById('barber').value.trim();  
    const clientId = document.getElementById('clientId').value.trim();  // Get the unique ID from the input

    if (name === "" || phone === "" || clientId === "") {
        alert("Please enter your name, phone number, and a unique ID.");
        return;
    }

    const barberToSave = barber === "" ? "Any barber" : barber;  // Default to "Any barber" if empty
    db.ref('queue/' + clientId).set({ clientId, name, phone, barber: barberToSave, status: 'waiting' }) // Add barber and client ID to the database
        .then(() => {
            console.log('Client added');
            document.getElementById('clientName').value = "";
            document.getElementById('clientPhone').value = "";
            document.getElementById('barber').value = "";  // Clear barber field
            document.getElementById('clientId').value = "";  // Clear client ID field
        })
        .catch(err => console.error('Error:', err));
});

// Display Queue
db.ref('queue').on('value', (snapshot) => {
    const queueStatus = document.getElementById('queueStatus');
    const queueData = snapshot.val();

    if (!queueData) {
        queueStatus.innerHTML = "<p>No clients in queue</p>";
        return;
    }

    queueStatus.innerHTML = Object.values(queueData)
        .map(client => `
            <p>
                <strong>${client.name}</strong> - ${client.phone} - Preferred Barber: ${client.barber || "Any barber"} 
            </p>
        `)
        .join('');
});

// Remove Yourself from Queue Button Click Event
document.getElementById('removeQueueBtn').addEventListener('click', () => {
    const removeClientId = document.getElementById('removeClientId').value.trim();

    if (removeClientId === "") {
        alert("Please enter your unique ID to remove yourself.");
        return;
    }

    // Check if the unique ID exists in the queue
    db.ref('queue/' + removeClientId).once('value').then(snapshot => {
        if (snapshot.exists()) {
            // Client exists in the queue, so we remove them
            db.ref('queue/' + removeClientId).remove()
                .then(() => {
                    alert("You have been removed from the queue.");
                    document.getElementById('removeClientId').value = "";  // Clear the input field
                })
                .catch(err => console.error('Error removing client:', err));
        } else {
            alert("No client found with that unique ID.");
        }
    });
});
