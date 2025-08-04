import React, { useEffect, useState } from 'react'
import { subApi } from '../../config/api.config';
import Loading from '../common/Loading';

const SubscriptionsList = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        subApi.get(`/admin/subscriptions/active`)
            .then(res => {
                console.log(res.data);
                setSubscriptions(res.data || []);
                setLoading(false);
            }).catch(err => {
                console.log(err);
                setLoading(false);
            })
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const handleCancel = (subscription) => {
        if(window.confirm('정말로 구독을 취소하시겠습니까?')) {
            subApi.post('/admin/subscriptions/cancel', {
                userId: subscription.userId._id,
                vehicleId: subscription.vehicleId
            })
                .then(() => {
                    // 취소된 구독을 목록에서 제거
                    setSubscriptions(subscriptions.filter(sub => sub._id !== subscription._id));
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
                    // 환불된 구독을 목록에서 제거
                    setSubscriptions(subscriptions.filter(sub => sub._id !== subscription._id));
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

    return (
        <div style={{ maxWidth: 1000, margin: '40px auto 0 auto', padding: '0 16px' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, borderBottom: '2px solid #1976d2', paddingBottom: 8, color: '#222', margin: 0 }}>
                활성 구독 목록
            </h2>
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
                    </>
                )}
            </div>
        </div>
    )
}

export default SubscriptionsList