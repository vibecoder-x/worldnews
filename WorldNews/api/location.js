// Serverless function to handle geolocation and reverse geocoding
// Proxies requests to avoid CORS issues

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { type, lat, lon, query } = req.query;

    try {
        if (type === 'reverse') {
            // Reverse geocoding using OpenStreetMap Nominatim
            if (!lat || !lon) {
                return res.status(400).json({ error: 'Latitude and longitude required' });
            }

            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'WorldNews.day/1.0'
                }
            });

            const data = await response.json();
            return res.status(200).json(data);

        } else if (type === 'geocode') {
            // Forward geocoding - convert city/country to coordinates
            if (!query) {
                return res.status(400).json({ error: 'Query parameter required for geocoding' });
            }

            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'WorldNews.day/1.0'
                }
            });

            const data = await response.json();
            return res.status(200).json(data);

        } else if (type === 'ip') {
            // IP-based geolocation
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return res.status(200).json(data);

        } else {
            return res.status(400).json({ error: 'Invalid type. Use "reverse", "geocode", or "ip"' });
        }
    } catch (error) {
        console.error('Location API Error:', error);
        return res.status(500).json({
            error: 'Failed to get location data',
            message: error.message
        });
    }
};
