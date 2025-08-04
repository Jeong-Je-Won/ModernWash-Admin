import React, { useState, useEffect } from 'react';
import { memberApi } from '../../config/api.config';

const EditMemberModal = ({ isOpen, onClose, onSuccess, memberId }) => {
    const [formData, setFormData] = useState({
        memberEmail: '',
        memberNickname: '',
        memberPhone: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // 회원 정보 가져오기
    useEffect(() => {
        if (isOpen && memberId) {
            setFetchLoading(true);
            memberApi.get(`/admin/members/${memberId}`)
                .then(res => {
                    const member = res.data;
                    setFormData({
                        memberEmail: member.memberEmail || '',
                        memberNickname: member.memberNickname || '',
                        memberPhone: member.memberPhone || ''
                    });
                    setFetchLoading(false);
                })
                .catch(err => {
                    console.error('회원 정보 조회 실패:', err);
                    alert('회원 정보를 불러오는데 실패했습니다.');
                    setFetchLoading(false);
                    onClose();
                });
        }
    }, [isOpen, memberId, onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // 에러 메시지 초기화
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 폼 검증
        const newErrors = {};
        const requiredFields = {
            memberEmail: '이메일',
            memberNickname: '닉네임',
            memberPhone: '전화번호'
        };

        // 빈 필드 확인
        Object.keys(requiredFields).forEach(field => {
            if (!formData[field] || formData[field].trim() === '') {
                newErrors[field] = `${requiredFields[field]}을(를) 입력해주세요.`;
            }
        });

        // 에러가 있으면 첫 번째 에러 필드에 포커스
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            const firstErrorField = Object.keys(newErrors)[0];
            const errorField = document.querySelector(`[name="${firstErrorField}"]`);
            if (errorField) {
                errorField.focus();
            }
            
            // alert로 안내
            const errorMessages = Object.values(newErrors).join('\n');
            alert(`다음 항목을 확인해주세요:\n\n${errorMessages}`);
            return;
        }

        setLoading(true);

        try {
            await memberApi.put(`/admin/members/${memberId}`, formData);
            alert('회원 정보가 성공적으로 수정되었습니다.');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('회원 수정 실패:', error);
            alert('회원 수정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
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
                width: '400px',
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
                        회원 수정
                    </h2>
                    <button
                        onClick={onClose}
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

                {fetchLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        회원 정보를 불러오는 중...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '500',
                                color: '#333'
                            }}>
                                이메일 *
                            </label>
                            <input
                                type="email"
                                name="memberEmail"
                                value={formData.memberEmail}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.memberEmail ? '1px solid #d32f2f' : '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="이메일을 입력하세요"
                            />
                            {errors.memberEmail && (
                                <div style={{
                                    color: '#d32f2f',
                                    fontSize: '12px',
                                    marginTop: '4px'
                                }}>
                                    {errors.memberEmail}
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '500',
                                color: '#333'
                            }}>
                                닉네임 *
                            </label>
                            <input
                                type="text"
                                name="memberNickname"
                                value={formData.memberNickname}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.memberNickname ? '1px solid #d32f2f' : '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="닉네임을 입력하세요"
                            />
                            {errors.memberNickname && (
                                <div style={{
                                    color: '#d32f2f',
                                    fontSize: '12px',
                                    marginTop: '4px'
                                }}>
                                    {errors.memberNickname}
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '500',
                                color: '#333'
                            }}>
                                전화번호 *
                            </label>
                            <input
                                type="tel"
                                name="memberPhone"
                                value={formData.memberPhone}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.memberPhone ? '1px solid #d32f2f' : '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="전화번호를 입력하세요 (예: 010-1234-5678)"
                            />
                            {errors.memberPhone && (
                                <div style={{
                                    color: '#d32f2f',
                                    fontSize: '12px',
                                    marginTop: '4px'
                                }}>
                                    {errors.memberPhone}
                                </div>
                            )}
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                type="button"
                                onClick={onClose}
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
                                disabled={loading}
                                style={{
                                    padding: '12px 24px',
                                    border: '1px solid #1976d2',
                                    borderRadius: '4px',
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    opacity: loading ? 0.6 : 1
                                }}
                            >
                                {loading ? '수정 중...' : '수정'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditMemberModal; 