import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService.updateNote', () => {
  let repo: SqliteNoteRepository;
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(':memory:');
    repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('actualiza solo el campo enviado y deja el resto intacto', () => {
    const created = repo.create({ title: 'Original', content: 'Contenido original', pinned: false });

    const updated = service.updateNote(created.id, { content: 'Contenido nuevo' });

    expect(updated?.content).toBe('Contenido nuevo'); // vino en el patch: cambió
    expect(updated?.title).toBe('Original');          // no vino: intacto
    expect(updated?.pinned).toBe(false);              // no vino: intacto
  });

  it('puede actualizar varios campos a la vez', () => {
    const created = repo.create({ title: 'A', content: 'B' });

    const updated = service.updateNote(created.id, { title: 'A2', pinned: true });

    expect(updated?.title).toBe('A2');
    expect(updated?.pinned).toBe(true);
    expect(updated?.content).toBe('B');
  });

  it('devuelve undefined cuando el id no existe', () => {
    expect(service.updateNote(999, { title: 'X' })).toBeUndefined();
  });
});