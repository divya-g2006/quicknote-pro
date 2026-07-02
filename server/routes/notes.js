const express = require('express')
const mongoose = require('mongoose')
const Note = require('../models/Note')

const router = express.Router()
const memoryNotes = []
let nextMemoryId = 1

function toJson(note) {
  return {
    id: note._id ? note._id.toString() : note.id,
    title: note.title,
    body: note.body,
    color: note.color,
    favorite: note.favorite,
    order: note.order,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt
  }
}

async function getNotesFromStore() {
  if (mongoose.connection.readyState === 1) {
    const notes = await Note.find().sort({ order: 1, createdAt: -1 })
    return notes
  }

  return memoryNotes.slice().sort((a, b) => a.order - b.order || new Date(b.createdAt) - new Date(a.createdAt))
}

async function createNoteInStore(payload) {
  if (mongoose.connection.readyState === 1) {
    return Note.create(payload)
  }

  const note = {
    id: String(nextMemoryId++),
    title: payload.title,
    body: payload.body || '',
    color: payload.color || 'butter',
    favorite: Boolean(payload.favorite),
    order: payload.order ?? 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  memoryNotes.unshift(note)
  return note
}

async function updateNoteInStore(id, updates) {
  if (mongoose.connection.readyState === 1) {
    return Note.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
  }

  const note = memoryNotes.find((item) => item.id === id)
  if (!note) return null

  Object.assign(note, updates, { updatedAt: new Date() })
  return note
}

async function deleteNoteInStore(id) {
  if (mongoose.connection.readyState === 1) {
    return Note.findByIdAndDelete(id)
  }

  const index = memoryNotes.findIndex((item) => item.id === id)
  if (index === -1) return null
  memoryNotes.splice(index, 1)
  return { success: true }
}

router.get('/', async (_req, res) => {
  try {
    const notes = await getNotesFromStore()
    res.json(notes.map(toJson))
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch notes' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { title, body, color, favorite, order } = req.body
    const note = await createNoteInStore({
      title,
      body: body || '',
      color: color || 'butter',
      favorite: Boolean(favorite),
      order: order ?? 0
    })

    res.status(201).json(toJson(note))
  } catch (error) {
    res.status(500).json({ error: 'Unable to create note' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const updates = {}
    if (req.body.title !== undefined) updates.title = req.body.title
    if (req.body.body !== undefined) updates.body = req.body.body
    if (req.body.color !== undefined) updates.color = req.body.color
    if (req.body.favorite !== undefined) updates.favorite = Boolean(req.body.favorite)
    if (req.body.order !== undefined) updates.order = Number(req.body.order)

    const note = await updateNoteInStore(req.params.id, updates)
    if (!note) return res.status(404).json({ error: 'Note not found' })

    res.json(toJson(note))
  } catch (error) {
    res.status(500).json({ error: 'Unable to update note' })
  }
})

router.patch('/:id/favorite', async (req, res) => {
  try {
    const note = await getNotesFromStore()
    const existing = note.find((item) => item._id ? item._id.toString() === req.params.id : item.id === req.params.id)
    if (!existing) return res.status(404).json({ error: 'Note not found' })

    if (mongoose.connection.readyState === 1) {
      existing.favorite = !existing.favorite
      await existing.save()
      return res.json(toJson(existing))
    }

    existing.favorite = !existing.favorite
    existing.updatedAt = new Date()
    res.json(toJson(existing))
  } catch (error) {
    res.status(500).json({ error: 'Unable to update favorite state' })
  }
})

router.patch('/reorder', async (req, res) => {
  try {
    const { ids } = req.body
    if (!Array.isArray(ids)) return res.status(400).json({ error: 'Invalid reorder payload' })

    if (mongoose.connection.readyState === 1) {
      await Promise.all(ids.map((id, index) => Note.findByIdAndUpdate(id, { order: index })))
    } else {
      ids.forEach((id, index) => {
        const note = memoryNotes.find((item) => item.id === id)
        if (note) note.order = index
      })
    }

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Unable to reorder notes' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const note = await deleteNoteInStore(req.params.id)
    if (!note) return res.status(404).json({ error: 'Note not found' })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete note' })
  }
})

module.exports = router
