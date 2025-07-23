import React, { useEffect, useState } from 'react'
import { api } from '../../config/api.config';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';
import Pagination from '../common/Pagination';
import { useSearchParams } from 'react-router-dom';

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const { userToken } = useUserStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if(userToken) {
      api.get(`admin/notices?page=${page}&limit=${limit}`)
        .then((res) => {
          setNotices(res.data.notices);
          setTotal(res.data.total || 0);
          setLoading(false);
        })
    } else {
      alert('관리자 권한이 없습니다.');
      nav('/');
    }
  }, [page, limit]);

  const handleDelete = (id) => {
    if(window.confirm('정말로 삭제하시겠습니까?')) {
      api.delete(`/admin/notices/${id}`)
        .then(() => {
          setNotices(notices.filter(notice => notice._id !== id));
        });
    }
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage, limit });
  };
  const totalPages = Math.ceil(total / limit);
  const groupSize = 5;
  const currentGroup = Math.floor((page - 1) / groupSize);
  const groupStart = currentGroup * groupSize + 1;
  const groupEnd = Math.min(groupStart + groupSize - 1, totalPages);

  return (
    <div style={{ maxWidth: 700, margin: '40px auto 0 auto', padding: '0 16px' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, borderBottom: '2px solid #1976d2', paddingBottom: 8, color: '#222', margin: 0 }}>
        공지사항 전체 목록
      </h2>
      <div style={{ minHeight: 220 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>로딩 중...</div>
        ) : (
          <>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                <thead>
                    <tr>
                        <th style={{
                            borderBottom: '2px solid #1976d2',
                            padding: '12px 4px', textAlign: 'left', fontWeight: 700, color: '#222', width: '70%'
                        }}>
                            글제목</th>
                        <th style={{
                            borderBottom: '2px solid #1976d2',
                            padding: '12px 4px', textAlign: 'center', fontWeight: 700, color: '#222', width: '30%'
                        }}>
                            관리</th>
                    </tr>
                </thead>
                <tbody>
                    {notices.map((notice, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                            <td
                                style={{
                                    padding: '12px 8px',
                                    fontSize: 16,
                                    color: '#222',
                                    cursor: 'pointer',
                                    transition: 'font-weight 0.2s'
                                }}
                                onClick={() => nav(`/admin/notices/${notice._id}`)}
                                onMouseOver={e => {
                                    e.currentTarget.style.fontWeight = '700';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.fontWeight = '500';
                                }}
                            >
                                {notice.title}
                            </td>
                            <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                                <button
                                    style={{
                                        marginRight: 8,
                                        padding: '6px 12px',
                                        background: '#1976d2',
                                        color: '#fff',
                                        border: '1px solid #1976d2',
                                        borderRadius: 4,
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
                                    onClick={() => nav(`/admin/notices/${notice._id}/edit`)}
                                >수정</button>
                                <button
                                    style={{
                                        padding: '6px 12px',
                                        background: '#d32f2f',
                                        color: '#fff',
                                        border: '1px solid #d32f2f',
                                        borderRadius: 4,
                                        cursor: 'pointer',
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
                                    onClick={() => handleDelete(notice._id)}
                                >삭제</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* 페이지네이션 영역 */}
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
                    onClick={() => nav('/admin/add-notice')}
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

export default Notice