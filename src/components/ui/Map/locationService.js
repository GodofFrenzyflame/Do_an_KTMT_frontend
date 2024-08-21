export const fetchUserLocation = async (apiKey) => {
    try {
        const response = await fetch(`https://ipinfo.io/117.2.233.59/json?token=58fa56cc132325`);
        const data = await response.json();
        if (response.ok) {
            const [latitude, longitude] = data.loc.split(',');
            return {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            };
        } else {
            throw new Error(data.error || 'Unable to fetch location');
        }
    } catch (error) {
        console.error('Error fetching IP location:', error);
        throw error;
    }
};
