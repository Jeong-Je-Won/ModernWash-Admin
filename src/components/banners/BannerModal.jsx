import React, { useState } from 'react';
import { bannerApi } from '../../config/api.config';

const BannerModal = ({ isOpen, onClose, onSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            
            // 미리보기 URL 생성
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            alert('파일을 선택해주세요.');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            await bannerApi.post('/admin/banners', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            alert('배너가 성공적으로 업로드되었습니다.');
            setSelectedFile(null);
            setPreviewUrl('');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('배너 업로드 실패:', error);
            alert('배너 업로드에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setPreviewUrl('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                width: '500px',
                maxWidth: '90vw',
                maxHeight: '90vh',
                overflow: 'auto'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#333'
                    }}>
                        배너 추가
                    </h2>
                    <button
                        onClick={handleClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#666',
                            padding: '0',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#333'
                        }}>
                            배너 이미지 *
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        />
                        <div style={{
                            fontSize: '12px',
                            color: '#666',
                            marginTop: '4px'
                        }}>
                            지원 형식: JPG, PNG, GIF (최대 5MB)
                        </div>
                    </div>

                    {previewUrl && (
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '500',
                                color: '#333'
                            }}>
                                미리보기
                            </label>
                            <div style={{
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                maxHeight: '200px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <img
                                    src={previewUrl}
                                    alt="미리보기"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '200px',
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'flex-end'
                    }}>
                        <button
                            type="button"
                            onClick={handleClose}
                            style={{
                                padding: '12px 24px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                backgroundColor: 'white',
                                color: '#666',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !selectedFile}
                            style={{
                                padding: '12px 24px',
                                border: '1px solid #1976d2',
                                borderRadius: '4px',
                                backgroundColor: loading || !selectedFile ? '#ccc' : '#1976d2',
                                color: 'white',
                                cursor: loading || !selectedFile ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                opacity: loading || !selectedFile ? 0.6 : 1
                            }}
                        >
                            {loading ? '업로드 중...' : '업로드'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BannerModal; 