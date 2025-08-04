import React, { useState } from 'react';
import { memberApi } from '../../config/api.config';

const MemberModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        memberEmail: '',
        memberPassword: '',
        memberPasswordConfirm: '',
        memberNickname: '',
        memberPhone: ''
    });
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // 비밀번호 확인 검증
        if (name === 'memberPassword' || name === 'memberPasswordConfirm') {
            if (name === 'memberPassword') {
                if (formData.memberPasswordConfirm && value !== formData.memberPasswordConfirm) {
                    setPasswordError('비밀번호가 일치하지 않습니다.');
                } else {
                    setPasswordError('');
                }
            } else if (name === 'memberPasswordConfirm') {
                if (formData.memberPassword && value !== formData.memberPassword) {
                    setPasswordError('비밀번호가 일치하지 않습니다.');
                } else {
                    setPasswordError('');
                }
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 폼 검증
        const newErrors = {};
        const requiredFields = {
            memberEmail: '이메일',
            memberPassword: '비밀번호',
            memberPasswordConfirm: '비밀번호 확인',
            memberNickname: '닉네임',
            memberPhone: '전화번호'
        };

        // 빈 필드 확인
        Object.keys(requiredFields).forEach(field => {
            if (!formData[field] || formData[field].trim() === '') {
                newErrors[field] = `${requiredFields[field]}을(를) 입력해주세요.`;
            }
        });

        // 비밀번호 확인 검증
        if (formData.memberPassword !== formData.memberPasswordConfirm) {
            setPasswordError('비밀번호가 일치하지 않습니다.');
            newErrors.memberPasswordConfirm = '비밀번호가 일치하지 않습니다.';
            
            // 비밀번호 확인 필드에 포커스
            const confirmField = document.querySelector('[name="memberPasswordConfirm"]');
            if (confirmField) {
                confirmField.focus();
            }
        }

        // 에러가 있으면 처리
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            
            // 비밀번호 불일치 에러가 있으면 비밀번호 확인 필드에 포커스
            if (newErrors.memberPasswordConfirm && newErrors.memberPasswordConfirm.includes('일치하지 않습니다')) {
                const confirmField = document.querySelector('[name="memberPasswordConfirm"]');
                if (confirmField) {
                    confirmField.focus();
                }
            } else {
                // 그 외 에러는 첫 번째 에러 필드에 포커스
                const firstErrorField = Object.keys(newErrors)[0];
                const errorField = document.querySelector(`[name="${firstErrorField}"]`);
                if (errorField) {
                    errorField.focus();
                }
            }
            
            // alert로 안내
            const errorMessages = Object.values(newErrors).join('\n');
            alert(`다음 항목을 확인해주세요:\n\n${errorMessages}`);
            return;
        }

        setLoading(true);

        try {
            const { memberPasswordConfirm, ...submitData } = formData;
            await memberApi.post('/admin/members', {
                ...submitData,
                provider: 'custom'
            });
            alert('회원이 성공적으로 생성되었습니다.');
            setFormData({
                memberEmail: '',
                memberPassword: '',
                memberPasswordConfirm: '',
                memberNickname: '',
                memberPhone: ''
            });
            setPasswordError('');
            setErrors({});
            onSuccess();
            onClose();
        } catch (error) {
            console.error('회원 생성 실패:', error);
            alert('회원 생성에 실패했습니다.');
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
                        회원 생성
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
                            비밀번호 *
                        </label>
                        <input
                            type="password"
                            name="memberPassword"
                            value={formData.memberPassword}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: errors.memberPassword ? '1px solid #d32f2f' : '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="비밀번호를 입력하세요"
                        />
                        {errors.memberPassword && (
                            <div style={{
                                color: '#d32f2f',
                                fontSize: '12px',
                                marginTop: '4px'
                            }}>
                                {errors.memberPassword}
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
                            비밀번호 확인 *
                        </label>
                        <input
                            type="password"
                            name="memberPasswordConfirm"
                            value={formData.memberPasswordConfirm}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: (passwordError || errors.memberPasswordConfirm) ? '1px solid #d32f2f' : '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="비밀번호를 다시 입력하세요"
                        />
                        {(passwordError || errors.memberPasswordConfirm) && (
                            <div style={{
                                color: '#d32f2f',
                                fontSize: '12px',
                                marginTop: '4px'
                            }}>
                                {passwordError || errors.memberPasswordConfirm}
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

                    <div style={{ marginBottom: '16px' }}>
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
                            {loading ? '생성 중...' : '생성'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MemberModal; 