import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - deleteNote (Ejercicio 5)', () => {
  let repo: SqliteNoteRepository;
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(':memory:');
    repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('elimina una nota existente y devuelve true', () => {
    const note = repo.create({ title: 'A', content: 'B' });

    expect(service.deleteNote(note.id)).toBe(true);
    expect(service.listNotes()).toHaveLength(0);
  });

  it('devuelve false si la nota no existe', () => {
    expect(service.deleteNote(9999)).toBe(false);
  });

  it('solo elimina la nota indicada', () => {
    const a = repo.create({ title: 'A', content: 'B' });
    const b = repo.create({ title: 'C', content: 'D' });

    service.deleteNote(a.id);

    const restantes = service.listNotes();
    expect(restantes).toHaveLength(1);
    expect(restantes[0].id).toBe(b.id);
  });
});