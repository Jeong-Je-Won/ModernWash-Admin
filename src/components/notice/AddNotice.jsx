import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../config/api.config';
import useUserStore from '../../store/useUserStore';

const AddNotice = () => {
  const nav = useNavigate();
  const { userToken } = useUserStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userToken) {
      alert('관리자 권한이 없습니다.');
      nav('/');
      return;
    }
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/admin/notices', { title, content });
      alert('공지사항이 등록되었습니다.');
      nav('/admin/notices');
    } catch (err) {
      alert('공지사항 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto 0 auto', padding: '0 16px' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, borderBottom: '2px solid #1976d2', paddingBottom: 8, color: '#222', margin: 0 }}>
        공지사항 등록
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
            disabled={loading}
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
              resize: 'vertical'
            }}
            placeholder="공지사항 내용을 입력하세요"
            disabled={loading}
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
              marginRight: 8
            }}
            onClick={() => nav('/admin/notices')}
            disabled={loading}
          >
            취소
          </button>
          <button
            type="submit"
            style={{
              padding: '8px 20px',
              background: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              fontWeight: 500,
              cursor: 'pointer'
            }}
            disabled={loading}
          >
            {loading ? '등록 중...' : '등록'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNotice;