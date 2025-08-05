import React, { useState, useEffect } from 'react';
import { memberApi } from '../../config/api.config';

const CardChangeModal = ({ isOpen, onClose, memberId, memberInfo }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentCardNumber: '',
        selectedCardId: '',
        newCardNumber: '',
        newCardExpiry: '',
        newCardCVC: '',
        newCardHolder: ''
    });
    const [errors, setErrors] = useState({});
    const [availableCards, setAvailableCards] = useState([]);

    useEffect(() => {
        if (isOpen && memberInfo) {
            // 기존 카드 정보가 있다면 설정
            setFormData(prev => ({
                ...prev,
                currentCardNumber: memberInfo.cardNumber || ''
            }));
            
            // 임시 카드 목록 (API 연동 전까지)
            const mockCards = [
                { id: 'card1', number: '1234 5678 9012 3456' },
                { id: 'card2', number: '9876 5432 1098 7654' },
                { id: 'card3', number: '1111 2222 3333 4444' },
                { id: 'card4', number: '5555 6666 7777 8888' }
            ];
            setAvailableCards(mockCards);
        }
    }, [isOpen, memberInfo]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // 에러 메시지 제거
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.selectedCardId) {
            newErrors.selectedCardId = '변경할 카드를 선택해주세요';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            // 첫 번째 에러 필드에 포커스
            const firstErrorField = Object.keys(errors)[0];
            if (firstErrorField) {
                document.querySelector(`[name="${firstErrorField}"]`)?.focus();
            }
            return;
        }
        
        setLoading(true);
        
        try {
            // 선택된 카드 정보 가져오기
            const selectedCard = availableCards.find(card => card.id === formData.selectedCardId);
            
            // API 연동 전까지는 alert로 선택된 카드 정보 표시
            alert(`카드가 변경되었습니다!\n\n선택된 카드: ${selectedCard.number}\n소유자: ${selectedCard.holder}\n만료일: ${selectedCard.expiry}`);
            
            onClose();
            setFormData({
                currentCardNumber: '',
                selectedCardId: '',
                newCardNumber: '',
                newCardExpiry: '',
                newCardCVC: '',
                newCardHolder: ''
            });
        } catch (err) {
            console.log(err);
            alert('카드 변경에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
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
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '24px',
                width: '500px',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    borderBottom: '2px solid #1976d2',
                    paddingBottom: '8px'
                }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#222' }}>
                        카드 정보 변경
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            color: '#666',
                            padding: '4px'
                        }}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* 기존 카드 정보 */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#333'
                        }}>
                            현재 카드번호
                        </label>
                        <input
                            type="text"
                            value={formData.currentCardNumber}
                            readOnly
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                backgroundColor: '#f5f5f5',
                                color: '#666',
                                minHeight: '44px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* 카드 선택 */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#333'
                        }}>
                            변경할 카드 선택 *
                        </label>
                        <select
                            name="selectedCardId"
                            value={formData.selectedCardId}
                            onChange={handleInputChange}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: `1px solid ${errors.selectedCardId ? '#d32f2f' : '#ddd'}`,
                                borderRadius: '4px',
                                fontSize: '14px',
                                backgroundColor: '#fff',
                                minHeight: '44px'
                            }}
                        >
                            <option value="">카드를 선택해주세요</option>
                            {availableCards.map(card => (
                                <option key={card.id} value={card.id} style={{ padding: '8px' }}>
                                    {card.number}
                                </option>
                            ))}
                        </select>
                        {errors.selectedCardId && (
                            <div style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px' }}>
                                {errors.selectedCardId}
                            </div>
                        )}
                    </div>

                    {/* 버튼 */}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'flex-end'
                    }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '10px 20px',
                                background: '#fff',
                                color: '#666',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                transition: 'background 0.2s, color 0.2s'
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.background = '#f5f5f5';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.background = '#fff';
                            }}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '10px 20px',
                                background: loading ? '#ccc' : '#1976d2',
                                color: '#fff',
                                border: '1px solid #1976d2',
                                borderRadius: '4px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                transition: 'background 0.2s, color 0.2s'
                            }}
                            onMouseOver={e => {
                                if (!loading) {
                                    e.currentTarget.style.background = '#fff';
                                    e.currentTarget.style.color = '#1976d2';
                                }
                            }}
                            onMouseOut={e => {
                                if (!loading) {
                                    e.currentTarget.style.background = '#1976d2';
                                    e.currentTarget.style.color = '#fff';
                                }
                            }}
                        >
                            {loading ? '처리 중...' : '변경'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CardChangeModal; 