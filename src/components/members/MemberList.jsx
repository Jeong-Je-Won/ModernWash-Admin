import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { memberApi } from '../../config/api.config';
import Loading from '../common/Loading';
import Pagination from '../common/Pagination';
import MemberModal from './MemberModal';
import EditMemberModal from './EditMemberModal';

const MemberList = () => {
    const nav = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState(null);

    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;

    useEffect(() => {
        setLoading(true);
        memberApi.get(`/admin/members?page=${page}&limit=${limit}`)
            .then(res => {
                console.log(res.data);
                setMembers(res.data.members || []);
                setTotal(res.data.total || 0);
                setLoading(false);
            }).catch(err => {
                console.log(err);
                setLoading(false);
            })
    }, [page, limit]);

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage, limit });
    };

    const handleDelete = (id) => {
        if(window.confirm('정말로 삭제하시겠습니까?')) {
            memberApi.delete(`/admin/members/${id}`)
                .then(() => {
                    // 현재 페이지가 1페이지가 아니고, 현재 페이지의 마지막 항목을 삭제한 경우 1페이지로 이동
                    const currentPageItems = members.length;
                    if (page > 1 && currentPageItems === 1) {
                        setSearchParams({ page: 1, limit });
                    } else {
                        // 현재 페이지에서 항목만 제거
                        setMembers(members.filter(member => member._id !== id));
                    }
                })
                .catch(err => {
                    console.log(err);
                    alert('삭제에 실패했습니다.');
                });
        }
    };

    const getProviderName = (provider) => {
        switch(provider) {
            case 'kakao': return '카카오';
            case 'apple': return '애플';
            case 'google': return '구글';
            case 'custom': return '일반';
            default: return provider;
        }
    };

    const totalPages = Math.ceil(total / limit);
    const groupSize = 5;

    if (loading) {
        return <Loading text="회원 목록을 불러오는 중..." />;
    }

  return (
        <div style={{ maxWidth: 1000, margin: '40px auto 0 auto', padding: '0 16px' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, borderBottom: '2px solid #1976d2', paddingBottom: 8, color: '#222', margin: 0 }}>
                회원 전체 목록
            </h2>
            <div style={{ minHeight: 220 }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>로딩 중...</div>
                ) : (
                    <>
                        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                            <thead>
                                <tr>
                                    <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'left', fontWeight: 700, color: '#222', width: '20%' }}>사용자명</th>
                                    <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'center', fontWeight: 700, color: '#222', width: '30%' }}>이메일</th>
                                    <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'center', fontWeight: 700, color: '#222', width: '20%' }}>전화번호</th>
                                    <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'center', fontWeight: 700, color: '#222', width: '15%' }}>포인트</th>
                                    <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'center', fontWeight: 700, color: '#222', width: '15%' }}>가입경로</th>
                                    <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'center', fontWeight: 700, color: '#222', width: '10%' }}>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.length > 0 ? (
                                    members.map((member, index) => (
                                        <tr key={member._id} style={{ borderBottom: '1px solid #eee' }}>
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
                                            >
                                                {member.memberNickname || '-'}
                                            </td>
                                            <td style={{ padding: '14px 10px', fontSize: 16, color: '#444', textAlign: 'center' }}>
                                                {member.memberEmail || '-'}
                                            </td>
                                            <td style={{ padding: '14px 10px', fontSize: 16, color: '#444', textAlign: 'center' }}>
                                                {member.memberPhone || '-'}
                                            </td>
                                            <td style={{ padding: '14px 10px', fontSize: 16, color: '#444', textAlign: 'center' }}>
                                                {member.memberPoints || 0}
                                            </td>
                                            <td style={{ padding: '14px 10px', fontSize: 16, color: '#444', textAlign: 'center' }}>
                                                {getProviderName(member.provider)}
                                            </td>
                                            <td style={{ padding: '14px 10px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                    <button
                                                        style={{
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
                                                        onClick={() => {
                                                            setSelectedMemberId(member._id);
                                                            setIsEditModalOpen(true);
                                                        }}
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
                                                        onClick={() => handleDelete(member._id)}
                                                    >삭제</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                                                            <td colSpan="6" style={{ 
                                        padding: '40px 20px', 
                                        textAlign: 'center', 
                                        color: '#666',
                                        fontSize: '14px'
                                    }}>
                                        등록된 회원이 없습니다.
                                    </td>
                                    </tr>
                                )}
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
                                onClick={() => setIsModalOpen(true)}
                            >
                                생성
                            </button>
                        </div>
                    </>
                )}
            </div>
            
            <MemberModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    // 회원 생성 후 목록 새로고침
                    memberApi.get(`/admin/members?page=${page}&limit=${limit}`)
                        .then(res => {
                            setMembers(res.data.members || []);
                            setTotal(res.data.total || 0);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }}
            />
            
            <EditMemberModal 
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedMemberId(null);
                }}
                onSuccess={() => {
                    // 회원 수정 후 목록 새로고침
                    memberApi.get(`/admin/members?page=${page}&limit=${limit}`)
                        .then(res => {
                            setMembers(res.data.members || []);
                            setTotal(res.data.total || 0);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }}
                memberId={selectedMemberId}
            />
        </div>
  )
}

export default MemberList