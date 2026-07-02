const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, default: '', trim: true },
    color: { type: String, default: 'butter' },
    favorite: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Note', noteSchema)
