import React from 'react';

const LimitSelect = ({ limit, onLimitChange }) => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      marginBottom: '16px'
    }}>
      <label style={{
        fontSize: '14px',
        fontWeight: 600,
        color: '#333'
      }}>
        페이지당 표시:
      </label>
      <select
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        style={{
          padding: '6px 12px',
          border: '1px solid #ddd',
          borderRadius: 4,
          fontSize: '14px',
          backgroundColor: '#fff',
          cursor: 'pointer'
        }}
      >
        <option value={10}>10개</option>
        <option value={30}>30개</option>
        <option value={50}>50개</option>
      </select>
    </div>
  );
};

export default LimitSelect; 