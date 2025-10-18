// Serverless function to proxy RSS feeds
// This avoids CORS issues when fetching RSS feeds from the browser

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'RSS feed URL required' });
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'WorldNews.day/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`RSS feed returned ${response.status}`);
        }

        const xmlData = await response.text();

        // Return XML with proper content type
        res.setHeader('Content-Type', 'application/xml');
        return res.status(200).send(xmlData);
    } catch (error) {
        console.error('RSS Fetch Error:', error);
        return res.status(500).json({
            error: 'Failed to fetch RSS feed',
            message: error.message,
            url: url
        });
    }
};
