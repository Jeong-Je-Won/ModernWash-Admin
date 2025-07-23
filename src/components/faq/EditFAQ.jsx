import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../config/api.config';
import useUserStore from '../../store/useUserStore';
import useCategoryStore from '../../store/categoryStroe';

const EditFAQ = () => {
  const categories = useCategoryStore(state => state.categories);

  const { id } = useParams();
  const nav = useNavigate();

  const { userToken } = useUserStore(); 
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userToken) {
      alert('관리자 권한이 없습니다.');
      nav('/');
      return;
    }
    api.get(`/admin/faqs/${id}`)
      .then((res) => {
        setQuestion(res.data.question);
        setAnswer(res.data.answer);
        setCategory(res.data.category);
        setLoading(false);
      })
      .catch(() => {
        alert('FAQ를 불러오지 못했습니다.');
        nav('/admin/faqs');
      });
  }, [id, nav, userToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim() || !category.trim()) {
      alert('질문, 답변, 카테고리를 모두 입력해주세요.');
      return;
    }
    try {
      await api.put(`/admin/faqs/${id}`, { question, answer, category });
      alert('FAQ가 수정되었습니다.');
      nav(`/admin/faqs`);
    } catch (err) {
      alert('FAQ 수정에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 1000, margin: '40px auto 0 auto', padding: '0 16px', textAlign: 'center' }}>
        로딩 중...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto 0 auto', padding: '0 16px' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, borderBottom: '2px solid #1976d2', paddingBottom: 8, color: '#222', margin: 0 }}>
        FAQ 수정
      </h2>
      <form onSubmit={handleSubmit} style={{ marginTop: 32, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#1976d2' }}>질문</label>
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: 16,
              border: '1px solid #ccc',
              borderRadius: 4,
              marginBottom: 8
            }}
            placeholder="FAQ 질문을 입력하세요"
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#1976d2' }}>카테고리</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: 16,
              border: '1px solid #ccc',
              borderRadius: 4,
              marginBottom: 8
            }}
          >
            <option value="">카테고리를 선택하세요</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#1976d2' }}>답변</label>
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            style={{
              width: '100%',
              minHeight: 180,
              padding: '10px 12px',
              fontSize: 16,
              border: '1px solid #ccc',
              borderRadius: 4,
              resize: 'vertical'
            }}
            placeholder="FAQ 답변을 입력하세요"
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
            onClick={() => nav(`/admin/faqs`)}
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

export default EditFAQ;