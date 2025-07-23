import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../config/api.config';
import useUserStore from '../../store/useUserStore';

const FAQDetail = () => {
  const { id } = useParams();
  const [faq, setFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const {userToken} = useUserStore();

  useEffect(() => {
    if(userToken) {
      api.get(`/admin/faqs/${id}`)
        .then((res) => {
          setFaq(res.data);
          setLoading(false);
        })
        .catch(() => {
          alert('FAQ를 불러오지 못했습니다.');
          nav('/admin/faqs');
        });
    } else {
      alert('관리자 권한이 없습니다.');
      nav('/');
    }
  }, [id, nav]);

  if (loading) {
    return (
      <div style={{ maxWidth: 1000, margin: '40px auto 0 auto', padding: '0 16px', textAlign: 'center' }}>
        로딩 중...
      </div>
    );
  }

  if (!faq) {
    return null;
  }

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto 0 auto', padding: '0 16px' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, borderBottom: '2px solid #1976d2', paddingBottom: 8, color: '#222', margin: 0 }}>
        FAQ 상세
      </h2>
      <div style={{ marginTop: 32, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#1976d2', marginBottom: 8 }}>{faq.question}</div>
          <div style={{ fontSize: 15, color: '#888', marginBottom: 4 }}>카테고리: {faq.category}</div>
          <div style={{ fontSize: 14, color: '#aaa' }}>작성일: {faq.createdAt ? faq.createdAt.slice(0, 10) : ''}</div>
        </div>
        <div style={{ fontSize: 16, color: '#222', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
          {faq.answer}
        </div>
      </div>
      <div style={{ marginTop: 24, textAlign: 'right' }}>
        <button
          style={{
            padding: '8px 20px',
            background: '#1976d2',
            color: '#fff',
            border: '1px solid #1976d2',
            borderRadius: 4,
            fontWeight: 500,
            cursor: 'pointer',
            marginRight: 8,
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.color = '#1976d2';
            e.currentTarget.style.border = '1px solid #1976d2';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#1976d2';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.border = '1px solid #1976d2';
          }}
          onClick={() => nav('/admin/faqs')}
        >
          목록으로
        </button>
        <button
          style={{
            padding: '8px 20px',
            background: '#1976d2',
            color: '#fff',
            border: '1px solid #1976d2',
            borderRadius: 4,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.color = '#1976d2';
            e.currentTarget.style.border = '1px solid #1976d2';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#1976d2';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.border = '1px solid #1976d2';
          }}
          onClick={() => nav(`/admin/faqs/${id}/edit`)}
        >
          수정
        </button>
        <button
          style={{
            padding: '8px 20px',
            background: '#d32f2f',
            color: '#fff',
            border: '1px solid #d32f2f',
            borderRadius: 4,
            fontWeight: 500,
            cursor: 'pointer',
            marginLeft: 8,
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.color = '#d32f2f';
            e.currentTarget.style.border = '1px solid #d32f2f';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#d32f2f';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.border = '1px solid #d32f2f';
          }}
          onClick={async () => {
            if (window.confirm('정말로 이 FAQ를 삭제하시겠습니까?')) {
              try {
                await api.delete(`/admin/faqs/${id}`);
                alert('FAQ가 삭제되었습니다.');
                nav('/admin/faqs');
              } catch (err) {
                alert('FAQ 삭제에 실패했습니다.');
              }
            }
          }}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default FAQDetail;