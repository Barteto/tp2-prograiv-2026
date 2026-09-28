import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { createDb } from '../../src/db/connection';
import {
  SqliteNoteRepository,
  NoteRepository,
} from '../../src/repositories/NoteRepository';
import { notify } from '../../src/services/notificationService';

// 🔴 EJERCICIO 1 — Este archivo YA ESTÁ ESCRITO y el test está en ROJO
// porque NoteService.createNote todavía no está implementado.
//
// Consigna: NO modifiquen este archivo. Vayan a
// src/services/NoteService.ts e implementen createNote hasta que estos
// 3 tests pasen (Verde). Después, refactoricen si hace falta.

// Mockeamos todo el módulo: notify pasa a ser un vi.fn() automáticamente
vi.mock('../../src/services/notificationService');

describe('NoteService - createNote (Ejercicio 1)', () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(':memory:');
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('crea una nota con id, title y content', () => {
    const note = service.createNote({ title: 'Comprar pan', content: 'Antes de las 20hs' });
    expect(note.id).toBeDefined();
    expect(note.title).toBe('Comprar pan');
    expect(note.content).toBe('Antes de las 20hs');
  });

  it('si no se indica pinned, por defecto es false', () => {
    const note = service.createNote({ title: 'A', content: 'B' });
    expect(note.pinned).toBe(false);
  });

  it('la nota creada aparece luego en listNotes()', () => {
    service.createNote({ title: 'A', content: 'B' });
    service.createNote({ title: 'C', content: 'D' });
    expect(service.listNotes()).toHaveLength(2);
  });
});

describe('NoteService - notificación al fijar (Ejercicio 6)', () => {
  // Fake repo mínimo: solo lo que createNote necesita
  const fakeRepo = {
    create: vi.fn(),
  } as unknown as NoteRepository;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('llama a notify cuando la nota se crea con pinned: true', () => {
    const createdNote = {
      id: 1,
      title: 'Urgente',
      content: 'Revisar esto',
      pinned: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };
    (fakeRepo.create as ReturnType<typeof vi.fn>).mockReturnValue(createdNote);

    const service = new NoteServiceImpl(fakeRepo);
    const result = service.createNote({
      title: 'Urgente',
      content: 'Revisar esto',
      pinned: true,
    });

    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith(createdNote);
    expect(result).toEqual(createdNote);
  });

  it('NO llama a notify cuando pinned es false o no viene', () => {
    const createdNote = {
      id: 2,
      title: 'Normal',
      content: 'Sin urgencia',
      pinned: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };
    (fakeRepo.create as ReturnType<typeof vi.fn>).mockReturnValue(createdNote);

    const service = new NoteServiceImpl(fakeRepo);
    service.createNote({ title: 'Normal', content: 'Sin urgencia' });

    expect(notify).not.toHaveBeenCalled();
  });
});
