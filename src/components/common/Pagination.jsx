import React from 'react';

const Pagination = ({ page, totalPages, groupSize = 5, onChange }) => {
  const currentGroup = Math.floor((page - 1) / groupSize);
  const groupStart = currentGroup * groupSize + 1;
  const groupEnd = Math.min(groupStart + groupSize - 1, totalPages);

  return (
    <div style={{ textAlign: 'center', marginTop: 24 }}>
      <button
        style={{
          margin: '0 8px',
          padding: '6px 16px',
          background: '#fff',
          color: '#1976d2',
          border: '1px solid #1976d2',
          borderRadius: 4,
          cursor: 'pointer',
          fontWeight: 500,
          transition: 'background 0.2s, color 0.2s',
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = '#1976d2';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = '#fff';
          e.currentTarget.style.color = '#1976d2';
        }}
        onClick={() => onChange(currentGroup === 0 ? 1 : groupStart - groupSize)}
      >
        이전 그룹
      </button>
      <button
        style={{
          margin: '0 8px',
          padding: '6px 16px',
          background: '#fff',
          color: '#1976d2',
          border: '1px solid #1976d2',
          borderRadius: 4,
          cursor: 'pointer',
          fontWeight: 500,
          transition: 'background 0.2s, color 0.2s',
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = '#1976d2';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = '#fff';
          e.currentTarget.style.color = '#1976d2';
        }}
        onClick={() => onChange(page > 1 ? page - 1 : 1)}
      >
        이전
      </button>
      {Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i).map(num => (
        <button
          key={num}
          style={{
            margin: '0 4px',
            padding: '6px 12px',
            background: page === num ? '#1976d2' : '#fff',
            color: page === num ? '#fff' : '#1976d2',
            border: '1px solid #1976d2',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: page === num ? 700 : 500,
            transition: 'background 0.2s, color 0.2s',
          }}
          onClick={() => onChange(num)}
        >
          {num}
        </button>
      ))}
      <button
        style={{
          margin: '0 8px',
          padding: '6px 16px',
          background: '#fff',
          color: '#1976d2',
          border: '1px solid #1976d2',
          borderRadius: 4,
          cursor: 'pointer',
          fontWeight: 500,
          transition: 'background 0.2s, color 0.2s',
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = '#1976d2';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = '#fff';
          e.currentTarget.style.color = '#1976d2';
        }}
        onClick={() => onChange(page < totalPages ? page + 1 : totalPages)}
      >
        다음
      </button>
      <button
        style={{
          margin: '0 8px',
          padding: '6px 16px',
          background: '#fff',
          color: '#1976d2',
          border: '1px solid #1976d2',
          borderRadius: 4,
          cursor: 'pointer',
          fontWeight: 500,
          transition: 'background 0.2s, color 0.2s',
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = '#1976d2';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = '#fff';
          e.currentTarget.style.color = '#1976d2';
        }}
        onClick={() => onChange(currentGroup === Math.floor((totalPages - 1) / groupSize) ? totalPages : groupEnd + 1)}
      >
        다음 그룹
      </button>
    </div>
  );
};

export default Pagination; 