import React, { useEffect, useState } from 'react'
import { api } from '../config/api.config';
import useUserStore from '../store/useUserStore';
import { useNavigate } from 'react-router-dom';
import Loading from './common/Loading';

const Index = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userToken } = useUserStore();
    const nav = useNavigate();

    useEffect(() => {
        api.get('/notices/latest-list').then((res) => {
            setNotices(res.data.notices);
            setLoading(false);
        });
    }, []);
  return (
    <div>
      {/* 최근 공지사항 영역 - 일반적인 사이트 스타일 */}
      <div style={{ maxWidth: 700, margin: '40px auto 0 auto', padding: '0 16px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, borderBottom: '2px solid #1976d2', paddingBottom: 8, color: '#222' }}>
          최근 공지사항
        </h2>
        <div style={{ minHeight: 220 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {loading ? (
              <Loading />
            ) : (
              notices.map((notice, index) => (
                <li key={index} style={{ marginBottom: '20px', fontSize: 16, fontWeight: 500, color: '#222' }}>
                  <div>{notice.title}</div>
                </li>
              ))
            )}
          </ul>
        </div>
        <div style={{ textAlign: 'right', marginTop: 12 }}>
          {
            userToken && (
              <div style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
               onClick={() => nav('/admin/notices')}>
                전체 보기 &gt;
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Index
