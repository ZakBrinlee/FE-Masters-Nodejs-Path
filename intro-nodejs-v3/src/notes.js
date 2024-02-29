import { getDB, saveDB, insertNote } from "./db.js";

export const newNote = async (note, tags) => {
  const newNote = {
    content: note,
    tags,
    id: Date.now(),
  };
  await insertNote(newNote);
  return newNote;
}

export const getAllNotes = async () => {
  const db = await getDB();
  return db.notes;
}

export const findNotes = async (filter) => {
  const notes = await getAllNotes();
  return notes.filter(note => note.content.toLowerCase().includes(filter.toLowerCase()));
}

export const removeNote = async (id) => {
  const notes = await getAllNotes();
  const match = notes.filter(note => note.id === id);
  
  if (match.length > 0) {
    const newNotes = notes.filter(note => note.id !== id);
    await saveDB({ notes: newNotes });
    return id;
  }
}

export const removeAllNotes = async () => {
  await saveDB({ notes: [] });
}
