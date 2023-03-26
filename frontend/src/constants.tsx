const CONSTANTS = {
    API_URL: 'http://localhost:3500',
    // Each element requires a unique key ID, this generates a quick 6-digit key
    GENERATE_ID: () => {
        const randomId = Math.random().toString(36).substr(2, 6);
        return randomId;
    }
}

export default CONSTANTS;