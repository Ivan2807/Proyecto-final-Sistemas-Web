import React, { useEffect, useState } from 'react'

export default function Formulario({ onSubmit, initial = null, onCancel, categorias = [], estados = [] }) {
  const [nombre, setNombre] = useState('')
  const [categoriaId, setCategoriaId] = useState(categorias[0]?.id ?? '')
  const [estado, setEstado] = useState(estados[0]?.id ?? '')
  const [puntuacion, setPuntuacion] = useState('')
  const [notas, setNotas] = useState('')
  const [atributos, setAtributos] = useState('')

  useEffect(() => {
    if (initial) {
      setNombre(initial.nombre ?? '')
      setCategoriaId(initial.categoriaId ?? categorias[0]?.id ?? '')
      setEstado(initial.estado ?? estados[0]?.id ?? '')
      setPuntuacion(initial.puntuacion != null ? String(initial.puntuacion) : '')
      setNotas(initial.notas ?? '')
      setAtributos(JSON.stringify(initial.atributos ?? {}, null, 2))
    }
  }, [initial, categorias, estados])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nombre.trim()) return
    let atributosJson = {}
    try {
      atributosJson = atributos.trim() ? JSON.parse(atributos) : {}
    } catch {
      alert('Atributos debe ser JSON válido')
      return
    }
    const payload = {
      nombre: nombre.trim(),
      categoriaId,
      estado,
      puntuacion: puntuacion === '' ? null : Number(puntuacion),
      notas: notas.trim(),
      atributos: atributosJson,
    }
    onSubmit(payload)
    if (!initial) {
      setNombre('')
      setCategoriaId(categorias[0]?.id ?? '')
      setEstado(estados[0]?.id ?? '')
      setPuntuacion('')
      setNotas('')
      setAtributos('{}')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
      <input value={nombre} placeholder="Nombre" onChange={(e) => setNombre(e.target.value)} />
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          {estados.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
        <input
          type="number"
          min="0"
          max="10"
          placeholder="Puntuación 0-10"
          value={puntuacion}
          onChange={(e) => setPuntuacion(e.target.value)}
        />
        <input placeholder="Notas" value={notas} onChange={(e) => setNotas(e.target.value)} />
      </div>
      <label>
        Atributos (JSON):
        <textarea value={atributos} onChange={(e) => setAtributos(e.target.value)} rows={4} />
      </label>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="submit">Guardar</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>Cancelar</button>
        )}
      </div>
    </form>
  )
}