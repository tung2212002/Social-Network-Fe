// Global variables
let peerConnection;
let localStream;
let remoteStream;
let client;
let groupCallId;

// WebSocket configuration
const wsConfig = {
    url: 'ws://localhost:8080/ws',
    topic: '/topic/public',
    app: '/app/channel',
};

// DOM elements
const elements = {
    localVideo: document.getElementById('localVideo'),
    remoteVideo: document.getElementById('remoteVideo'),
    callButton: document.getElementById('callButton'),
};

// Auto-connect function
function autoConnect() {
    const token = getStoredToken();
    if (!token) {
        console.error('No token found. User might need to log in.');
        return;
    }
    verifyTokenAndConnect(token);
}

// Get stored token (implement this based on your auth system)
function getStoredToken() {
    // This is a placeholder. Implement your own token retrieval logic.
    return localStorage.getItem('userToken');
}

// Verify token and connect to WebSocket
function verifyTokenAndConnect(token) {
    axios
        .get('http://localhost:8080/api/v1/auth/verify-token', {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            const userData = res.data.data;
            wsConfig.topic = `/channel/app/${userData.userId}`;
            connectWebSocket(token);
        })
        .catch((err) => {
            console.error('Token verification failed:', err);
            // Handle the error appropriately, maybe redirect to login page
        });
}

// Connect to WebSocket
function connectWebSocket(token) {
    const urlWithToken = `${wsConfig.url}?token=${encodeURIComponent(token)}`;

    client = new StompJs.Client({
        brokerURL: urlWithToken,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
        client.subscribe(wsConfig.topic, handleIncomingMessage);
        console.log('Connected to WebSocket');
        initialize(); // Initialize WebRTC after successful connection
    };

    client.onWebSocketError = (error) => console.error('WebSocket error', error);
    client.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };

    client.activate();
}

// Handle incoming WebSocket messages
function handleIncomingMessage(message) {
    const data = JSON.parse(message.body);
    switch (data.event) {
        case 'offer':
            handleOffer(data.data);
            break;
        case 'answer':
            handleAnswer(data.data);
            break;
        case 'candidate':
            handleCandidate(data.data);
            break;
        default:
            console.warn('Unknown message type:', data.event);
    }
}

// Get group call ID from URL query parameter
function getGroupIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('g');
}

// Initialize WebRTC
function initialize() {
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    peerConnection = new RTCPeerConnection(configuration);

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            sendMessage('candidate', event.candidate);
        }
    };

    peerConnection.ontrack = (event) => {
        elements.remoteVideo.srcObject = event.streams[0];
        remoteStream = event.streams[0];
    };

    navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
            localStream = stream;
            elements.localVideo.srcObject = localStream;
            localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
        })
        .catch((e) => console.error('getUserMedia() error: ', e));
}

// Create and send offer
function createOffer() {
    peerConnection
        .createOffer()
        .then((offer) => {
            sendMessage('offer', offer);
            return peerConnection.setLocalDescription(offer);
        })
        .catch((error) => console.error('Error creating an offer:', error));
}

// Handle received offer
function handleOffer(offer) {
    peerConnection
        .setRemoteDescription(new RTCSessionDescription(offer))
        .then(() => peerConnection.createAnswer())
        .then((answer) => {
            peerConnection.setLocalDescription(answer);
            sendMessage('answer', answer);
        })
        .catch((error) => console.error('Error handling offer:', error));
}

// Handle received ICE candidate
function handleCandidate(candidate) {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch((error) => console.error('Error adding ice candidate:', error));
}

// Handle received answer
function handleAnswer(answer) {
    peerConnection
        .setRemoteDescription(new RTCSessionDescription(answer))
        .then(() => console.log('Connection established successfully!'))
        .catch((error) => console.error('Error handling answer:', error));
}

// Send message through WebSocket
function sendMessage(event, data) {
    if (client && client.connected) {
        client.publish({
            destination: wsConfig.app,
            body: JSON.stringify({ event, data, groupCallId }),
        });
    } else {
        console.error('Client is not connected');
    }
}

// Event listeners
window.addEventListener('load', () => {
    groupCallId = getGroupIdFromUrl();
    if (!groupCallId) {
        console.error('No group ID found in URL. Please provide a group ID.');
        // Handle the error appropriately, e.g., show an error message to the user
        return;
    }
    autoConnect(); // Auto-connect when the page loads
    elements.callButton.addEventListener('click', createOffer);
});
