import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewsFeed = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNews = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('https://newsapi.org/v2/top-headlines', {
                params: {
                    country: 'us',
                    apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY
                }
            });
            setNews(response.data.articles);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <div style={{ width: '100%', overflowY: 'hidden' }}>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                news.map((article, index) => (
                    <div key={index} style={{ marginBottom: '20px', padding: '10px', borderBottom: '1px solid #ddd', textAlign:'left' }}>
                        <h3>{article.title}</h3>
                        <p>{article.description}</p>
                        {article.urlToImage && (
                            <img src={article.urlToImage} alt="News" style={{ width: '100%', borderRadius: '5px' }} />
                        )}
                        <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: '10px', color: '#00DC82' }}>
                            Read More
                        </a>
                    </div>
                ))
            )}
        </div>
    );
};

export default NewsFeed;