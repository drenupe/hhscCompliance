import { KnowledgePackLoader, KnowledgePackLoadError } from './knowledge-pack.loader';
import { texasHcsKnowledgePack } from '../packs/texas-hcs/texas-hcs.knowledge-pack';
import { KnowledgeRepository } from '../repositories/knowledge-repository.interface';
import { KnowledgePackValidator } from '../validators/knowledge-pack.validator';

describe('KnowledgePackLoader', () => {
  let loader: KnowledgePackLoader;
  let repository: jest.Mocked<
    Pick<
      KnowledgeRepository,
      'register' | 'unregister' | 'hasPack' | 'getLoadedPackIds'
    >
  >;

  beforeEach(() => {
    repository = {
      register: jest.fn(),
      unregister: jest.fn(),
      hasPack: jest.fn(),
      getLoadedPackIds: jest.fn(),
    };

    loader = new KnowledgePackLoader(
      new KnowledgePackValidator(),
      repository as unknown as KnowledgeRepository,
    );
  });

  it('validates and registers a valid knowledge pack', () => {
    const result = loader.load(texasHcsKnowledgePack);

    expect(result.loaded).toBe(true);
    expect(result.packId).toBe('texas-hcs');
    expect(result.validation.valid).toBe(true);
    expect(repository.register).toHaveBeenCalledTimes(1);
    expect(repository.register).toHaveBeenCalledWith(texasHcsKnowledgePack);
  });

  it('rejects an invalid pack without registering it', () => {
    const invalidPack = {
      ...texasHcsKnowledgePack,
      metadata: {
        ...texasHcsKnowledgePack.metadata,
        name: '',
      },
    };

    expect(() => loader.load(invalidPack)).toThrow(KnowledgePackLoadError);
    expect(repository.register).not.toHaveBeenCalled();
  });

  it('validates the entire batch before registering any pack', () => {
    const invalidPack = {
      ...texasHcsKnowledgePack,
      metadata: {
        ...texasHcsKnowledgePack.metadata,
        name: '',
      },
    };

    expect(() =>
      loader.loadMany([texasHcsKnowledgePack, invalidPack]),
    ).toThrow(KnowledgePackLoadError);

    expect(repository.register).not.toHaveBeenCalled();
  });

  it('registers every pack when the entire batch is valid', () => {
    const secondPack = {
      ...texasHcsKnowledgePack,
      metadata: {
        ...texasHcsKnowledgePack.metadata,
        id: 'texas-hcs-test-pack',
        code: 'TX-HCS-TEST',
      },
    };

    const results = loader.loadMany([
      texasHcsKnowledgePack,
      secondPack,
    ]);

    expect(results).toHaveLength(2);
    expect(results.every((result) => result.loaded)).toBe(true);
    expect(repository.register).toHaveBeenCalledTimes(2);
    expect(repository.register).toHaveBeenNthCalledWith(
      1,
      texasHcsKnowledgePack,
    );
    expect(repository.register).toHaveBeenNthCalledWith(2, secondPack);
  });

  it('routes reload through the normal validation and registration path', () => {
    const result = loader.reload(texasHcsKnowledgePack);

    expect(result.loaded).toBe(true);
    expect(repository.register).toHaveBeenCalledTimes(1);
    expect(repository.register).toHaveBeenCalledWith(texasHcsKnowledgePack);
  });

  it('delegates unload and loaded-pack queries to the repository', () => {
    repository.hasPack.mockReturnValue(true);
    repository.getLoadedPackIds.mockReturnValue(['texas-hcs']);

    loader.unload('texas-hcs');

    expect(repository.unregister).toHaveBeenCalledWith('texas-hcs');
    expect(loader.isLoaded('texas-hcs')).toBe(true);
    expect(loader.getLoadedPackIds()).toEqual(['texas-hcs']);
    expect(repository.hasPack).toHaveBeenCalledWith('texas-hcs');
    expect(repository.getLoadedPackIds).toHaveBeenCalledTimes(1);
  });
});
