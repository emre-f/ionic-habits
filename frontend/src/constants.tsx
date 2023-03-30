const CONSTANTS = {
    API_URL: 'http://localhost:3500',
    // Each element requires a unique key ID, this generates a quick 6-digit key
    GENERATE_ID: () => {
        const randomId = Math.random().toString(36).substr(2, 6);
        return randomId;
    },
    GET_COOKIES: () => {
        // Turn the cookies into a JSON with key/value pairs and print it out
        const cookies = JSON.stringify(document.cookie.split(';').reduce((res, c) => {
            const [key, val] = c.trim().split('=').map(decodeURIComponent)
            try {
                return Object.assign(res, { [key]: JSON.parse(val) })
            } catch (e) {
                return Object.assign(res, { [key]: val })
            }
        }, {}), null, 2)
        
        return cookies
    }
}

export default CONSTANTS;