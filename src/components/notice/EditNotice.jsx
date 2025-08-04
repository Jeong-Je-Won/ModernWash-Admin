import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../config/api.config';
import useUserStore from '../../store/useUserStore';

const EditNotice = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { userToken } = useUserStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userToken) {
      alert('관리자 권한이 없습니다.');
      nav('/');
      return;
    }
    api.get(`/admin/notices/${id}`)
      .then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
        setLoading(false);
      })
      .catch(() => {
        alert('공지사항을 불러오지 못했습니다.');
        nav('/admin/notices');
      });
  }, [id, nav, userToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    try {
      await api.put(`/admin/notices/${id}`, { title, content });
      alert('공지사항이 수정되었습니다.');
      nav(`/admin/notices/${id}`);
    } catch (err) {
      alert('공지사항 수정에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto 0 auto', padding: '0 16px', textAlign: 'center' }}>
        로딩 중...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto 0 auto', padding: '0 16px' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, borderBottom: '2px solid #1976d2', paddingBottom: 8, color: '#222', margin: 0 }}>
        공지사항 수정
      </h2>
      <form onSubmit={handleSubmit} style={{ marginTop: 32, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#1976d2' }}>제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: 16,
              border: '1px solid #ccc',
              borderRadius: 4,
              marginBottom: 8
            }}
            placeholder="공지사항 제목을 입력하세요"
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#1976d2' }}>내용</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            style={{
              width: '100%',
              minHeight: 180,
              padding: '10px 12px',
              fontSize: 16,
              border: '1px solid #ccc',
              borderRadius: 4,
              resize: 'vertical',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.5'
            }}
            placeholder="공지사항 내용을 입력하세요"
          />
        </div>
        <div style={{ textAlign: 'right' }}>
          <button
            type="button"
            style={{
              padding: '8px 20px',
              background: '#fff',
              color: '#1976d2',
              border: '1px solid #1976d2',
              borderRadius: 4,
              fontWeight: 500,
              cursor: 'pointer',
              marginRight: 8,
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#1976d2';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.border = '1px solid #1976d2';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#1976d2';
              e.currentTarget.style.border = '1px solid #1976d2';
            }}
            onClick={() => nav(`/admin/notices`)}
          >
            돌아가기
          </button>
          <button
            type="submit"
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
          >
            저장
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNotice;