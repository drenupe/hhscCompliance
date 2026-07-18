import { KnowledgePack } from '../models/knowledge-pack.model';
import { KnowledgeRepository } from '../repositories/knowledge-repository.interface';
import {
  KnowledgePackValidationResult,
  KnowledgePackValidator,
} from '../validators/knowledge-pack.validator';

export class KnowledgePackLoadError extends Error {
  constructor(
    public readonly packId: string,
    public readonly validation: KnowledgePackValidationResult,
  ) {
    super(
      `Knowledge pack "${packId}" failed validation with ${validation.errors.length} error(s).`,
    );

    this.name = 'KnowledgePackLoadError';
  }
}

export interface KnowledgePackLoadResult {
  packId: string;
  loaded: boolean;
  validation: KnowledgePackValidationResult;
}

export class KnowledgePackLoader {
  constructor(
    private readonly validator: KnowledgePackValidator,
    private readonly repository: KnowledgeRepository,
  ) {}

  load(pack: KnowledgePack): KnowledgePackLoadResult {
    const validation = this.validator.validate(pack);
    const packId = pack.metadata?.id || 'UNKNOWN_PACK';

    if (!validation.valid) {
      throw new KnowledgePackLoadError(packId, validation);
    }

    this.repository.register(pack);

    return {
      packId,
      loaded: true,
      validation,
    };
  }

  loadMany(packs: KnowledgePack[]): KnowledgePackLoadResult[] {
    const validatedPacks = packs.map((pack) => ({
      pack,
      packId: pack.metadata?.id || 'UNKNOWN_PACK',
      validation: this.validator.validate(pack),
    }));

    const invalidPack = validatedPacks.find(
      ({ validation }) => !validation.valid,
    );

    if (invalidPack) {
      throw new KnowledgePackLoadError(
        invalidPack.packId,
        invalidPack.validation,
      );
    }

    validatedPacks.forEach(({ pack }) => {
      this.repository.register(pack);
    });

    return validatedPacks.map(({ packId, validation }) => ({
      packId,
      loaded: true,
      validation,
    }));
  }

  reload(pack: KnowledgePack): KnowledgePackLoadResult {
    return this.load(pack);
  }

  unload(packId: string): void {
    this.repository.unregister(packId);
  }

  isLoaded(packId: string): boolean {
    return this.repository.hasPack(packId);
  }

  getLoadedPackIds(): string[] {
    return this.repository.getLoadedPackIds();
  }
}