import React, { useEffect, useState } from 'react'
import { bannerApi } from '../../config/api.config';
import Loading from '../common/Loading';
import BannerModal from './BannerModal';

const BannerList = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        bannerApi.get(`/admin/banners`)
            .then(res => {
                console.log(res.data);
                setBanners(res.data || []);
                setLoading(false);
            }).catch(err => {
                console.log(err);
                setLoading(false);
            })
    }, []);

    const handleToggleActive = (fileName, currentStatus) => {
        bannerApi.put(`/admin/banners/${fileName}/activate`)
            .then(() => {
                // 활성화된 배너는 다른 배너들을 비활성화
                setBanners(banners.map(banner => ({
                    ...banner,
                    isActive: banner.fileName === fileName
                })));
            })
            .catch(err => {
                console.log(err);
                alert('상태 변경에 실패했습니다.');
            });
    };

    const handleDelete = (fileName) => {
        if(window.confirm('정말로 삭제하시겠습니까?')) {
            bannerApi.delete(`/admin/banners/${fileName}`)
                .then(() => {
                    setBanners(banners.filter(banner => banner.fileName !== fileName));
                })
                .catch(err => {
                    console.log(err);
                    alert('삭제에 실패했습니다.');
                });
        }
    };

    if (loading) {
        return <Loading text="배너 목록을 불러오는 중..." />;
    }

    return (
        <div style={{ maxWidth: 1200, margin: '40px auto 0 auto', padding: '0 16px' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, borderBottom: '2px solid #1976d2', paddingBottom: 8, color: '#222', margin: 0 }}>
                배너 관리
            </h2>
            
            <div style={{ minHeight: 220 }}>
                {banners.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '20px',
                        marginTop: '20px'
                    }}>
                        {banners.map((banner) => (
                            <div
                                key={banner._id}
                                style={{
                                    border: banner.isActive ? '3px solid #1976d2' : '1px solid #ddd',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    backgroundColor: 'white',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '200px',
                                    overflow: 'hidden'
                                }}>
                                    <img
                                        src={`https://api.modernwash.co.kr${banner.url}`}
                                        alt={banner.fileName}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div
                                        style={{
                                            display: 'none',
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: '#f5f5f5',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#666',
                                            fontSize: '14px'
                                        }}
                                    >
                                        이미지를 불러올 수 없습니다
                                    </div>
                                </div>
                                
                                <div style={{ padding: '16px' }}>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#666',
                                        marginBottom: '8px',
                                        wordBreak: 'break-all'
                                    }}>
                                        {banner.fileName}
                                    </div>
                                    
                                    <div style={{
                                        display: 'flex',
                                        gap: '8px',
                                        justifyContent: 'flex-end'
                                    }}>
                                        <button
                                            style={{
                                                padding: '6px 12px',
                                                background: banner.isActive ? '#d32f2f' : '#1976d2',
                                                color: '#fff',
                                                border: `1px solid ${banner.isActive ? '#d32f2f' : '#1976d2'}`,
                                                borderRadius: 4,
                                                cursor: 'pointer',
                                                fontSize: 12,
                                                transition: 'background 0.2s, color 0.2s',
                                            }}
                                            onMouseOver={e => {
                                                e.currentTarget.style.background = '#fff';
                                                e.currentTarget.style.color = banner.isActive ? '#d32f2f' : '#1976d2';
                                                e.currentTarget.style.border = `1px solid ${banner.isActive ? '#d32f2f' : '#1976d2'}`;
                                            }}
                                            onMouseOut={e => {
                                                e.currentTarget.style.background = banner.isActive ? '#d32f2f' : '#1976d2';
                                                e.currentTarget.style.color = '#fff';
                                                e.currentTarget.style.border = `1px solid ${banner.isActive ? '#d32f2f' : '#1976d2'}`;
                                            }}
                                            onClick={() => handleToggleActive(banner.fileName, banner.isActive)}
                                        >
                                            {banner.isActive ? '비활성화' : '활성화'}
                                        </button>
                                        <button
                                            style={{
                                                padding: '6px 12px',
                                                background: '#d32f2f',
                                                color: '#fff',
                                                border: '1px solid #d32f2f',
                                                borderRadius: 4,
                                                cursor: 'pointer',
                                                fontSize: 12,
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
                                            onClick={() => handleDelete(banner.fileName)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#666',
                        fontSize: '14px'
                    }}>
                        등록된 배너가 없습니다.
                    </div>
                )}
                
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
                        추가
                    </button>
                </div>
            </div>
            
            <BannerModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    // 배너 추가 후 목록 새로고침
                    bannerApi.get(`/admin/banners`)
                        .then(res => {
                            setBanners(res.data || []);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }}
            />
        </div>
    )
}

export default BannerList
