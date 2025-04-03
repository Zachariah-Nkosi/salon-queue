// Firebase Config
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

// Join Queue
document.getElementById('joinQueueBtn').addEventListener('click', () => {
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    
    if (name === "" || phone === "") {
        alert("Please enter both name and phone number.");
        return;
    }

    const clientId = Date.now();
    db.ref('queue/' + clientId).set({ clientId, name, phone, status: 'waiting' })
        .then(() => {
            document.getElementById('clientName').value = "";
            document.getElementById('clientPhone').value = "";
        })
        .catch(err => console.error('Error:', err));
});

const queueRef = db.ref('queue');

queueRef.on('value', (snapshot) => {
    const queueStatus = document.getElementById('queueStatus');
    queueStatus.innerHTML = ""; // Clear before updating

    if (snapshot.exists()) {
        snapshot.forEach(childSnapshot => {
            const client = childSnapshot.val();
            queueStatus.innerHTML += `<p><strong>${client.name}</strong> - ${client.phone}</p>`;
        });
    } else {
        queueStatus.innerHTML = "<p>No clients in queue</p>";
    }
});
