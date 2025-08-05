import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { subApi } from '../../config/api.config';
import Loading from '../common/Loading';
import Pagination from '../common/Pagination';
import LimitSelect from '../common/LimitSelect';

const SubscriptionsList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [subscriptions, setSubscriptions] = useState([]);
    const [allSubscriptions, setAllSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;

    useEffect(() => {
        setLoading(true);
        subApi.get('/admin/subscriptions/active')
            .then(res => {
                console.log(res.data);
                let allSubscriptions = [];
                
                // API가 배열로 반환되는 경우
                if (Array.isArray(res.data)) {
                    allSubscriptions = res.data;
                } else {
                    // API가 객체로 반환되는 경우 (subscriptions, total 포함)
                    allSubscriptions = res.data.subscriptions || res.data || [];
                }
                
                setAllSubscriptions(allSubscriptions);
                setLoading(false);
            }).catch(err => {
                console.log(err);
                setLoading(false);
            })
    }, []);

    // 검색과 페이지네이션을 위한 별도 useEffect
    useEffect(() => {
        if (allSubscriptions.length > 0) {
            // 검색 필터링
            let filteredSubscriptions = allSubscriptions;
            if (searchTerm) {
                filteredSubscriptions = allSubscriptions.filter(subscription => 
                    subscription.userId?.memberNickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    subscription.userId?.memberEmail?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            
            setTotal(filteredSubscriptions.length);
            
            // 클라이언트 사이드 페이지네이션
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedSubscriptions = filteredSubscriptions.slice(startIndex, endIndex);
            
            setSubscriptions(paginatedSubscriptions);
        }
    }, [allSubscriptions, page, limit, searchTerm]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage, limit });
    };

    const handleLimitChange = (newLimit) => {
        setSearchParams({ page: 1, limit: newLimit });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // 검색 버튼이나 엔터를 눌렀을 때만 검색 실행
        setSearchTerm(searchInput);
        setSearchParams({ page: 1, limit });
    };

    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleCancel = (subscription) => {
        if(window.confirm('정말로 구독을 취소하시겠습니까?')) {
            subApi.post('/admin/subscriptions/cancel', {
                userId: subscription.userId._id,
                vehicleId: subscription.vehicleId
            })
                .then(() => {
                    // 취소된 구독을 전체 목록에서 제거
                    setAllSubscriptions(allSubscriptions.filter(sub => sub._id !== subscription._id));
                    alert('구독이 취소되었습니다.');
                })
                .catch(err => {
                    console.log(err);
                    alert('구독 취소에 실패했습니다.');
                });
        }
    };

    const handleRefund = (subscription) => {
        if(window.confirm('정말로 환불하시겠습니까?')) {
            subApi.post('/admin/subscriptions/refund', {
                userId: subscription.userId._id,
                vehicleId: subscription.vehicleId
            })
                .then(() => {
                    // 환불된 구독을 전체 목록에서 제거
                    setAllSubscriptions(allSubscriptions.filter(sub => sub._id !== subscription._id));
                    alert('환불이 완료되었습니다.');
                })
                .catch(err => {
                    console.log(err);
                    alert(`환불에 실패했습니다. ${err.response.data.message}`);
                });
        }
    };

    if (loading) {
        return <Loading text="구독 목록을 불러오는 중..." />;
    }

    const totalPages = Math.ceil(total / limit);
    const groupSize = 5;

    return (
        <div style={{ maxWidth: 1000, margin: '40px auto 0 auto', padding: '0 16px' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, borderBottom: '2px solid #1976d2', paddingBottom: 8, color: '#222', margin: 0 }}>
                활성 구독 목록
            </h2>
            
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        placeholder="사용자명으로 검색"
                        value={searchInput}
                        onChange={handleSearchInputChange}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearch(e);
                            }
                        }}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            width: '250px'
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '8px 16px',
                            background: '#1976d2',
                            color: '#fff',
                            border: '1px solid #1976d2',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'background 0.2s, color 0.2s'
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.background = '#fff';
                            e.currentTarget.style.color = '#1976d2';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.background = '#1976d2';
                            e.currentTarget.style.color = '#fff';
                        }}
                    >
                        검색
                    </button>
                </form>
                <LimitSelect limit={limit} onLimitChange={handleLimitChange} />
            </div>
            <div style={{ minHeight: 220 }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>로딩 중...</div>
                ) : (
                    <>
                        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                            <thead>
                                <tr>
                                    <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'left', fontWeight: 700, color: '#222', width: '15%' }}>구독 ID</th>
                                    <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'center', fontWeight: 700, color: '#222', width: '20%' }}>사용자</th>
                                    <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'center', fontWeight: 700, color: '#222', width: '15%' }}>차량번호</th>
                                    <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'center', fontWeight: 700, color: '#222', width: '15%' }}>상품</th>
                                    <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'center', fontWeight: 700, color: '#222', width: '15%' }}>만료일</th>
                                    <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'center', fontWeight: 700, color: '#222', width: '10%' }}>상태</th>
                                    <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'center', fontWeight: 700, color: '#222', width: '10%' }}>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscriptions.length > 0 ? (
                                    subscriptions.map((subscription, index) => (
                                        <tr key={subscription._id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td
                                                style={{
                                                    padding: '14px 10px',
                                                    fontSize: 14,
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
                                                {subscription._id.slice(0, 8)}...
                                            </td>
                                            <td style={{ padding: '14px 10px', fontSize: 16, color: '#444', textAlign: 'center' }}>
                                                <div style={{ marginBottom: '4px' }}>
                                                    {subscription.userId?.memberNickname || '-'}
                                                </div>
                                                <div style={{ fontSize: 14, color: '#666' }}>
                                                    {subscription.userId?.memberEmail || '-'}
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 10px', fontSize: 16, color: '#444', textAlign: 'center' }}>
                                                {subscription.vehicleId?.licensePlate || '-'}
                                            </td>
                                            <td style={{ padding: '14px 10px', fontSize: 16, color: '#444', textAlign: 'center' }}>
                                                {subscription.productId === 'daily_subscription' ? '데일리' : 
                                                 subscription.productId === 'all_in_one_subscription' ? '올인원' :
                                                 subscription.productId}
                                            </td>
                                            <td style={{ padding: '14px 10px', fontSize: 16, color: '#444', textAlign: 'center' }}>
                                                {subscription.expirationDate ? formatDate(subscription.expirationDate) : '-'}
                                            </td>
                                            <td style={{ padding: '14px 10px', textAlign: 'center' }}>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    backgroundColor: 
                                                        subscription.status === 'active' ? '#e8f5e8' :
                                                        subscription.status === 'cancelled' ? '#fff3e0' :
                                                        subscription.status === 'refunded' ? '#f3e5f5' : '#ffe8e8',
                                                    color: 
                                                        subscription.status === 'active' ? '#2e7d32' :
                                                        subscription.status === 'cancelled' ? '#f57c00' :
                                                        subscription.status === 'refunded' ? '#7b1fa2' : '#d32f2f'
                                                }}>
                                                    {subscription.status === 'active' ? '활성' : 
                                                     subscription.status === 'cancelled' ? '취소' :
                                                     subscription.status === 'refunded' ? '환불' : subscription.status}
                                                </span>
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
                                                            whiteSpace: 'nowrap',
                                                            textAlign: 'center',
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
                                                        onClick={() => handleCancel(subscription)}
                                                    >취소</button>
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
                                                            whiteSpace: 'nowrap',
                                                            textAlign: 'center',
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
                                                        onClick={() => handleRefund(subscription)}
                                                    >환불</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ 
                                            padding: '40px 20px', 
                                            textAlign: 'center', 
                                            color: '#666',
                                            fontSize: '14px'
                                        }}>
                                            활성 구독이 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        
                        <Pagination 
                            page={page} 
                            totalPages={totalPages} 
                            groupSize={groupSize} 
                            onChange={handlePageChange} 
                        />
                    </>
                )}
            </div>
        </div>
    )
}

export default SubscriptionsList