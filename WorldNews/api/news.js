// Serverless function to proxy news API requests
// This avoids CORS issues when calling news APIs from the browser

const NEWS_APIS = {
    newsapi: {
        key: process.env.NEWSAPI_KEY || '5ff2e88241d7494a8add4b009533eef1',
        endpoint: 'https://newsapi.org/v2'
    },
    gnews: {
        key: process.env.GNEWS_KEY || 'dba2727f20fd5a6d763df225da065b48',
        endpoint: 'https://gnews.io/api/v4'
    },
    currentsapi: {
        key: process.env.CURRENTSAPI_KEY || 'PtGocmbDg_VtVUH-VvBMm0agRDJzdF3Zy-sgTc8lovnF0MFx',
        endpoint: 'https://api.currentsapi.services/v1'
    }
};

const COUNTRY_CODES = {
    en: 'us',
    es: 'es',
    fr: 'fr',
    de: 'de',
    ar: 'ae',
    zh: 'cn',
    hi: 'in'
};

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { api = 'newsapi', category = 'general', language = 'en', page = 1, pageSize = 12, query } = req.query;

    try {
        let url, headers = {};

        if (api === 'newsapi') {
            if (query) {
                // Search endpoint
                const params = new URLSearchParams({
                    apiKey: NEWS_APIS.newsapi.key,
                    q: query,
                    language,
                    pageSize,
                    page,
                    sortBy: 'publishedAt'
                });
                url = `${NEWS_APIS.newsapi.endpoint}/everything?${params}`;
            } else {
                // Use top-headlines for better results
                const country = COUNTRY_CODES[language] || 'us';
                const params = new URLSearchParams({
                    apiKey: NEWS_APIS.newsapi.key,
                    pageSize,
                    page,
                    language
                });

                if (category !== 'all' && category !== 'general') {
                    params.append('category', category);
                } else {
                    params.append('country', country);
                }

                url = `${NEWS_APIS.newsapi.endpoint}/top-headlines?${params}`;
            }
        } else if (api === 'gnews') {
            if (query) {
                const params = new URLSearchParams({
                    apikey: NEWS_APIS.gnews.key,
                    q: query,
                    lang: language,
                    max: pageSize
                });
                url = `${NEWS_APIS.gnews.endpoint}/search?${params}`;
            } else {
                const params = new URLSearchParams({
                    apikey: NEWS_APIS.gnews.key,
                    lang: language,
                    max: pageSize,
                    page
                });

                if (category !== 'all' && category !== 'general') {
                    params.append('topic', category);
                }

                url = `${NEWS_APIS.gnews.endpoint}/top-headlines?${params}`;
            }
        } else if (api === 'currentsapi') {
            const params = new URLSearchParams({
                apiKey: NEWS_APIS.currentsapi.key,
                language,
                page_size: pageSize,
                page_number: page
            });

            if (category !== 'all' && category !== 'general') {
                params.append('category', category);
            }

            url = `${NEWS_APIS.currentsapi.endpoint}/latest-news?${params}`;
        } else {
            return res.status(400).json({ error: 'Invalid API specified' });
        }

        const response = await fetch(url, { headers });
        const data = await response.json();

        return res.status(200).json(data);
    } catch (error) {
        console.error('News API Error:', error);
        return res.status(500).json({
            error: 'Failed to fetch news',
            message: error.message
        });
    }
};
