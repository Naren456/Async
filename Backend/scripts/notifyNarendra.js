const sendNarendraNotification = async () => {
    try {
        console.log("🔍 Triggering notification from running server...");
        
        const response = await fetch('http://localhost:8000/test-narendra');
        const text = await response.text();
        
        console.log("Server response:", text);

    } catch (error) {
        console.error("❌ Error sending notification:", error);
    }
};

// Execute if run directly
sendNarendraNotification();
