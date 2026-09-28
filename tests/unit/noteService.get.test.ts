import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService.getNote', () => {
  let repo: SqliteNoteRepository;
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(':memory:');
    repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('devuelve la nota cuando el id existe', () => {
    const created = repo.create({ title: 'Comprar pan', content: 'Antes de las 20hs' });
    expect(service.getNote(created.id)).toEqual(created);
  });

  it('devuelve undefined cuando el id no existe', () => {
    expect(service.getNote(999)).toBeUndefined();
  });
});