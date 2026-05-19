import React from 'react';
import { CATEGORIAS, getCategoriaById } from '../utils/Categorias';

export default function Categorias({ value, onChange }) {
  const handleSelect = (id) => {
    onChange?.(id === value ? null : id);
  };

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {CATEGORIAS.map((c) => (
        <button
          key={c.id}
          onClick={() => handleSelect(c.id)}
          aria-pressed={value === c.id}
          style={{
            border: value === c.id ? `2px solid ${c.color}` : '1px solid #ddd',
            background: value === c.id ? c.color + '22' : '#fff',
            color: value === c.id ? '#000' : '#111',
            padding: '6px 10px',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          {c.nombre}
        </button>
      ))}
    </div>
  );
}
