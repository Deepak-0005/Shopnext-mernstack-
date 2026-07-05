import React from 'react';

const About = () => {
    const containerStyle = {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px',
        background: '#18181b',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        textAlign: 'center'
    };
const socialBtnStyle = {
    margin: '10px',
    padding: '10px 20px',
    background: '#27272a',
    color: '#ffffff',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.1)'
};

return (
    <div style={containerStyle}>
        {/* Profile Image */}
        <img
            src="/photo(laddu).jpeg"
            alt="@Deepak"
            style={{ width: '180px', height: '180px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #f97316', marginBottom: '20px', boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)' }}
        />

        {/* Social Media Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
                href="https://github.com/Deepak-0005" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ padding: '10px 20px', borderRadius: '25px', border: '2px solid #f97316', color: '#f97316', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}
            >
                GitHub
            </a>
            
            <a 
                href="https://wa.me/918187010469" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ padding: '10px 20px', borderRadius: '25px', border: '2px solid #f97316', color: '#f97316', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}
            >
                WhatsApp
            </a>

            <a 
                href="https://www.instagram.com/deepak_sampangi_/" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ padding: '10px 20px', borderRadius: '25px', border: '2px solid #f97316', color: '#f97316', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}
            >
                Instagram
            </a>
        </div>
    </div>
);
};

export default About;
