const express = require('express');
const router = express.Router();
const {pool} = require ('../../Db/db.js');

//Obetener los juegos que estan activos
router.get('/', async (req, res, next) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM juegos WHERE activo = 1 ORDER BY "fechaRegistro" DESC'
    );
    res.json(resultado.rows);
  } catch (err) {
    next(err);
  }
});

// Obtener todos los registros de actividad
router.get('/registros', async (req, res, next) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM registros ORDER BY fecha DESC'
    );
    res.json(resultado.rows);
  } catch (err) {
    next(err);
  }
});

//Obtener un juego por su id
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {   
    const resultado = await pool.query(
      'SELECT * FROM juegos WHERE id = $1',
      [req.params.id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    next(err);
  }
});

//Poner un juego
router.post('/', async (req, res, next) => {
  try {
    const {
      id, nombre, categoriaId, estado,
      puntuacion, fechaRegistro, fechaActividad,
      notas, atributos
    } = req.body;

    if (!id || !nombre) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: id, nombre' });
    }

    await pool.query(
      `INSERT INTO juegos
        (id, nombre, "categoriaId", estado, puntuacion,
         "fechaRegistro", "fechaActividad", notas, atributos, activo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,1)`,
      [
        id, nombre, categoriaId, estado ?? 'pendiente',
        puntuacion ?? null, fechaRegistro, fechaActividad,
        notas, atributos ? JSON.stringify(atributos) : null
      ]
    );

    res.status(201).json({ mensaje: 'Juego creado', id });
  } catch (err) {
    next(err);
  }
});

//Actualizar un juego
router.put('/:id', async (req, res, next) => {
  try {
    const {
      nombre, categoriaId, estado,
      puntuacion, fechaActividad, notas, atributos
    } = req.body;

    const resultado = await pool.query(
      `UPDATE juegos
       SET nombre=$1, "categoriaId"=$2, estado=$3, puntuacion=$4,
           "fechaActividad"=$5, notas=$6, atributos=$7
       WHERE id=$8`,
      [
        nombre, categoriaId, estado,
        puntuacion ?? null, fechaActividad,
        notas, atributos ? JSON.stringify(atributos) : null,
        req.params.id
      ]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    res.json({ mensaje: 'Juego actualizado' });
  } catch (err) {
    next(err);
  }
});

//registrar horas
router.post('/:id/registro', async (req, res, next) => {
  try {
    const { id, fecha, valor, notas } = req.body;

    if (!id || !fecha || valor === undefined) {
      return res.status(400).json({ error: 'Faltan campos: id, fecha, valor' });
    }

    // Verificar que el juego existe
    const juego = await pool.query(
      'SELECT id FROM juegos WHERE id = $1',
      [req.params.id]
    );
    if (juego.rows.length === 0) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    await pool.query(
      'INSERT INTO registros (id, "itemId", fecha, valor, notas) VALUES ($1,$2,$3,$4,$5)',
      [id, req.params.id, fecha, valor, notas]
    );

    // Actualizar fechaActividad del juego
    await pool.query(
      'UPDATE juegos SET "fechaActividad" = $1 WHERE id = $2',
      [fecha, req.params.id]
    );

    res.status(201).json({ mensaje: 'Registro guardado', id });
  } catch (err) {
    next(err);
  }
});

// Archivar un juego (activo = false)
router.delete('/:id', async (req, res, next) => {
  try {
    const resultado = await pool.query(
      'UPDATE juegos SET activo = 0 WHERE id = $1',
      [req.params.id]
    );
    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    res.json({ mensaje: 'Juego archivado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
