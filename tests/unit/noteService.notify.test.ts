import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { notify } from '../../src/services/notificationService';
import { NoteRepository } from '../../src/repositories/NoteRepository';

// Mockea el módulo completo: notify pasa a ser un vi.fn()
vi.mock('../../src/services/notificationService');

describe('NoteService - notificación al fijar (Ejercicio 6)', () => {
  const fakeRepo = {
    create: vi.fn(),
  } as unknown as NoteRepository;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('llama a notify con la nota creada cuando pinned es true', () => {
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