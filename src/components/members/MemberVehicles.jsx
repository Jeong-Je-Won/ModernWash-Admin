import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { memberApi } from '../../config/api.config';
import Loading from '../common/Loading';

const MemberVehicles = () => {
    const { memberId } = useParams();
    const nav = useNavigate();
    const [member, setMember] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        memberApi.get(`/admin/members/${memberId}`)
            .then(res => {
                console.log('Member data:', res.data);
                setMember(res.data);
                setVehicles(res.data.vehicles || []);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                alert('멤버 정보를 불러오지 못했습니다.');
                nav('/admin/members');
            });
    }, [memberId, nav]);

    if (loading) {
        return <Loading text="멤버 차량 목록을 불러오는 중..." />;
    }

    if (!member) {
        return (
            <div style={{ maxWidth: 1000, margin: '40px auto 0 auto', padding: '0 16px', textAlign: 'center' }}>
                멤버를 찾을 수 없습니다.
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1000, margin: '40px auto 0 auto', padding: '0 16px' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, borderBottom: '2px solid #1976d2', paddingBottom: 8, color: '#222', margin: 0 }}>
                멤버 차량 목록
            </h2>
            
            {/* 멤버 정보 */}
            <div style={{ 
                marginTop: '20px', 
                background: '#fff', 
                borderRadius: 8, 
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '20px'
            }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1976d2', marginBottom: '12px' }}>
                    멤버 정보
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div>
                        <span style={{ fontWeight: 600, color: '#666' }}>이름: </span>
                        <span>{member.memberNickname || '-'}</span>
                    </div>
                    <div>
                        <span style={{ fontWeight: 600, color: '#666' }}>이메일: </span>
                        <span>{member.memberEmail || '-'}</span>
                    </div>
                    <div>
                        <span style={{ fontWeight: 600, color: '#666' }}>전화번호: </span>
                        <span>{member.phoneNumber || '-'}</span>
                    </div>
                    <div>
                        <span style={{ fontWeight: 600, color: '#666' }}>포인트: </span>
                        <span>{member.point || 0}점</span>
                    </div>
                </div>
            </div>

            {/* 차량 목록 */}
            <div style={{ minHeight: 220 }}>
                {vehicles.length > 0 ? (
                    <>
                        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                            <thead>
                                <tr>
                                    <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'center', fontWeight: 700, color: '#222', width: '20%' }}>차량번호</th>
                                    <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'center', fontWeight: 700, color: '#222', width: '20%' }}>차종</th>
                                    <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'center', fontWeight: 700, color: '#222', width: '20%' }}>색상</th>
                                    <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'center', fontWeight: 700, color: '#222', width: '20%' }}>등록일</th>
                                    <th style={{ borderBottom: '2px solid #1976d2', padding: '14px 8px', textAlign: 'center', fontWeight: 700, color: '#222', width: '20%' }}>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.map((vehicle, index) => (
                                    <tr key={vehicle._id || index} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '14px 10px', fontSize: 16, color: '#444', textAlign: 'center' }}>
                                            {vehicle.licensePlate || '-'}
                                        </td>
                                        <td style={{ padding: '14px 10px', fontSize: 16, color: '#444', textAlign: 'center' }}>
                                            {vehicle.model || '-'}
                                        </td>
                                        <td style={{ padding: '14px 10px', fontSize: 16, color: '#444', textAlign: 'center' }}>
                                            {vehicle.color || '-'}
                                        </td>
                                        <td style={{ padding: '14px 10px', fontSize: 16, color: '#444', textAlign: 'center' }}>
                                            {vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString('ko-KR') : '-'}
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
                                                    onClick={() => alert('카드변경 기능은 추후 구현 예정입니다.')}
                                                >카드변경</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#666',
                        fontSize: '14px',
                        background: '#fff',
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        등록된 차량이 없습니다.
                    </div>
                )}
            </div>

            {/* 뒤로가기 버튼 */}
            <div style={{ textAlign: 'right', marginTop: 20 }}>
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
                    onClick={() => nav('/admin/members')}
                >
                    목록으로
                </button>
            </div>
        </div>
    );
};

export default MemberVehicles; 