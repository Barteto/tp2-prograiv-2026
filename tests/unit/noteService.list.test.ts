import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import { createDb } from '../../src/db/connection';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { NoteServiceImpl } from '../../src/services/NoteService';

describe('NoteService - listNotes', () => {
  let db: Database.Database;
  let service: NoteServiceImpl;

  beforeEach(() => {
    db = createDb();
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  afterEach(() => {
    db.close();
  });

  it('devuelve una lista vacía cuando no hay notas', () => {
    expect(service.listNotes()).toEqual([]);
  });

  it('devuelve todas las notas creadas', () => {
    service.createNote({
      title: 'Nota 1',
      content: 'Contenido 1'
    });

    service.createNote({
      title: 'Nota 2',
      content: 'Contenido 2',
      pinned: true
    });

    const notes = service.listNotes();

    expect(notes).toHaveLength(2);
    expect(notes[0].title).toBe('Nota 1');
    expect(notes[1].title).toBe('Nota 2');
    expect(notes[1].pinned).toBe(true);
  });
});
