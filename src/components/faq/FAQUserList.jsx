import React, { useEffect, useState } from 'react'
import useCategoryStore from '../../store/categoryStroe';
import { api } from '../../config/api.config';

const FAQUserList = () => {
    const categories = useCategoryStore(state => state.categories);
    const [selectedCategoryId, setSelectedCategoryId] = useState(categories.length > 0 ? categories[0].id : null);

    const [faqs, setFaqs] = useState([]);

    const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

    const handleCategoryClick = (categoryId) => {
        setSelectedCategoryId(categoryId);
    }

    useEffect(() => {
        api.get(`/faqs`)
            .then(res => {
                setFaqs(res.data.faqs);
            })
    }, []);

    const selectedCategoryObj = faqs.find(faq => faq.category === selectedCategory?.name);
    const items = selectedCategoryObj ? selectedCategoryObj.items : [];

  return (
      <div style={{ maxWidth: 800, margin: '40px auto 0 auto', padding: '0 16px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, borderBottom: '2px solid #1976d2', paddingBottom: 8, color: '#222', margin: 0 }}>
          자주 묻는 질문
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <thead>
            <tr>
              {categories.map(category => (
                <th
                  key={category.id}
                  style={{
                    padding: '16px 0',
                    borderBottom: '2px solid #1976d2',
                    fontWeight: 600,
                    color: selectedCategoryId === category.id ? '#fff' : '#1976d2',
                    fontSize: 18,
                    cursor: 'pointer',
                    background: selectedCategoryId === category.id ? '#1976d2' : '#f5faff',
                    transition: 'background 0.2s, color 0.2s'
                  }}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div style={{ marginTop: 40, background: '#f9f9f9', borderRadius: 8, padding: 32, minHeight: 120, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
            <div>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888', fontSize: 17, padding: '32px 0' }}>
                  등록된 질문이 없습니다.
                </div>
              ) : (
                items.map(item => (
                  <div key={item._id} style={{
                    background: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: 8,
                    marginBottom: 24,
                    padding: '24px 20px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                  }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1976d2', marginBottom: 12 }}>{item.question}</h3>
                    <p style={{ fontSize: 16, color: '#444', margin: 0 }}>{item.answer}</p>
                  </div>
                ))
              )}
            </div>
        </div>
      </div>
    );
}

export default FAQUserList