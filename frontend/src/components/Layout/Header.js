import React from 'react';

const Header = () => {
    return (
        <div className="container">
            <div
                style={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '25px',
                    color: '#333333',
                    padding: '10px',
                }}
            >
                <div style={{ fontWeight: 'bold' }}>LOVES</div>
                <div>Powered by VIM Services</div>
            </div>
        </div>
    );
};

export default Header;