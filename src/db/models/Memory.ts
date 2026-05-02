import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';
import { open, seal } from '@/crypto/encryption';

export type MemoryKind = 'text' | 'voice' | 'image';

export class Memory extends Model {
  static table = 'memories';

  @field('text_ct') textCiphertext!: string;
  @field('text_iv') textIv!: string;
  @field('kind') kind!: MemoryKind;
  @field('embedding_version') embeddingVersion!: number;
  @field('embedded_at') embeddedAt!: number | null;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  /**
   * Hydrates plaintext on demand. Hold the result no longer than necessary —
   * plaintext should not be passed across module boundaries casually.
   */
  async readText(): Promise<string> {
    return open({ ciphertext: this.textCiphertext, iv: this.textIv });
  }

  static async sealText(plaintext: string) {
    return seal(plaintext);
  }
}
