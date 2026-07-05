import React from 'react';

const textualStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px',
    background: '#18181b',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    lineHeight: '1.8',
    color: '#a1a1aa'
};

const Disclaimer = () => {
    return (
    <div style={textualStyle}>
        <h2 style={{ color: '#fff', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px' }}>
            Legal & Site Disclaimer
        </h2>
        <p style={{ marginBottom: '20px' }}>
            The data, interfaces, and graphical components represented across the ShopNest domain strictly act uniquely as an educational development platform. This codebase models rigorous application structures and architectures for purely demonstrative, portfolio-oriented engineering usage.
        </p>
        <h4 style={{ color: '#f97316', marginTop: '25px', marginBottom: '10px' }}>
            1. Accuracy of Materials
        </h4>
        <p style={{ marginBottom: '15px' }}>
            The materials spanning the ShopNest interface may heavily include dynamic technical, typographical, or dummy photographic elements. Product matrices mapped in the DB pipeline do absolutely not correlate to strictly real physical outputs and are safely populated via generic Unsplash imagery protocols.
        </p>
    </div>
);
};
export default Disclaimer;