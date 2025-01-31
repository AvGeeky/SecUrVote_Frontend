// eslint-disable-next-line no-unused-vars
import React from 'react';

export const Logo = ({ className = "w-10 h-10" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 20H4V4H20V20Z" stroke="#4FD1C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8V16" stroke="#4FD1C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 12H16" stroke="#4FD1C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
