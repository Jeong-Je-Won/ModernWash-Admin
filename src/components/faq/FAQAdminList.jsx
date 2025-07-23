import React, { useEffect, useState } from 'react'
import { api } from '../../config/api.config';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from '../common/Pagination';
import useUserStore from '../../store/useUserStore';

const FAQAdminList = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const { userToken } = useUserStore();

  useEffect(() => {
    setLoading(true);
    if(userToken) {
      api.get(`/admin/faqs?page=${page}&limit=${limit}`)
        .then((res) => {
          setFaqs(res.data.faqs);
          setTotal(res.data.total || 0);
          setLoading(false);
        })
    } else {
      alert('관리자 권한이 없습니다.');
      nav('/');
    }
  }, [page, limit]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage, limit });
  };

  const totalPages = Math.ceil(total / limit);
  const groupSize = 5;

  const handleDelete = (id) => {
    if(window.confirm('정말로 삭제하시겠습니까?')) {
      api.delete(`/admin/faqs/${id}`)
        .then(() => {
          setFaqs(faqs.filter(faq => faq._id !== id));
        });
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto 0 auto', padding: '0 16px' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, borderBottom: '2px solid #1976d2', paddingBottom: 8, color: '#222', margin: 0 }}>
        FAQ 전체 목록
      </h2>
      <div style={{ minHeight: 220 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>로딩 중...</div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'left', fontWeight: 700, color: '#222', width: '50%' }}>질문</th>
                  <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'center', fontWeight: 700, color: '#222', width: '20%' }}>카테고리</th>
                  <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'center', fontWeight: 700, color: '#222', width: '20%' }}>작성일</th>
                  <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'center', fontWeight: 700, color: '#222', width: '10%' }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((faq, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td
                      style={{
                        padding: '14px 10px',
                        fontSize: 17,
                        color: '#222',
                        cursor: 'pointer',
                        transition: 'font-weight 0.2s'
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.fontWeight = '700';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.fontWeight = '500';
                      }}
                      onClick={() => nav(`/admin/faqs/${faq._id}`)}
                    >
                      {faq.question}
                    </td>
                    <td style={{ padding: '14px 10px', fontSize: 16, color: '#444', textAlign: 'center' }}>{faq.category}</td>
                    <td style={{ padding: '14px 10px', fontSize: 16, color: '#444', textAlign: 'center' }}>{faq.createdAt ? faq.createdAt.slice(0, 10) : ''}</td>
                    <td style={{ padding: '14px 10px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button
                          style={{
                            marginRight: 0,
                            padding: '7px 16px',
                            background: '#1976d2',
                            color: '#fff',
                            border: '1px solid #1976d2',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 15,
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
                          onClick={() => nav(`/admin/faqs/${faq._id}/edit`)}
                        >수정</button>
                        <button
                          style={{
                            padding: '7px 16px',
                            background: '#d32f2f',
                            color: '#fff',
                            border: '1px solid #d32f2f',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 15,
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
                          onClick={() => {handleDelete(faq._id)}}
                        >삭제</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={page} totalPages={totalPages} groupSize={groupSize} onChange={handlePageChange} />
            <div style={{ textAlign: 'right', marginTop: 20 }}>
              <button
                style={{
                  background: '#1976d2',
                  color: '#fff',
                  border: '1px solid #1976d2',
                  borderRadius: 4,
                  padding: '8px 20px',
                  fontSize: 15,
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
                onClick={() => nav('/admin/add-faq')}
              >
                추가
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default FAQAdminList