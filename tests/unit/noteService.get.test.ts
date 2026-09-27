import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { NoteRepository } from '../../src/repositories/NoteRepository';
import { Note, NewNote, NotePatch } from '../../src/models/Note';

function makeFakeRepo(): NoteRepository {
  let notes: Note[] = [];
  let nextId = 1;
  return {
    create(data: NewNote): Note {
      const now = new Date().toISOString();
      const note: Note = { id: nextId++, title: data.title, content: data.content,
        pinned: data.pinned ?? false, createdAt: now, updatedAt: now };
      notes.push(note);
      return note;
    },
    findAll: () => notes,
    findById: (id) => notes.find(n => n.id === id),
    update(id, patch) {
      const note = notes.find(n => n.id === id);
      if (!note) return undefined;
      Object.assign(note, patch, { updatedAt: new Date().toISOString() });
      return note;
    },
    delete(id) {
      const before = notes.length;
      notes = notes.filter(n => n.id !== id);
      return notes.length < before;
    },
    clear: () => { notes = []; }
  };
}

describe('NoteService.getNote', () => {
  let repo: NoteRepository;
  let service: NoteServiceImpl;

  beforeEach(() => {
    repo = makeFakeRepo();
    service = new NoteServiceImpl(repo);
  });

  it('devuelve la nota cuando el id existe', () => {
    const created = repo.create({ title: 'Titulo de ejemplo', content: 'Texto de ejemplo' });
    expect(service.getNote(created.id)).toEqual(created);
  });

  it('devuelve undefined cuando el id no existe', () => {
    expect(service.getNote(999)).toBeUndefined();
  });
});