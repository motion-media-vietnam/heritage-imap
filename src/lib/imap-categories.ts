/** Shared category registry for prototype markers, directory and filters only. */
import type { CityId, DestinationId, DestinationRecord } from './destination-content.ts';

/** Identifiers for existing trusted SVG paths in imap-neighborhood.ts, not asset URLs. */
export type ImapCategoryIconId = 'landmark' | 'compass' | 'utensils' | 'shopping-bag';

/** Stable content IDs are independent of translated labels and SVG identifiers. */
export const imapCategories = [
  { id: 'stamp-worthy-spot', label: 'Điểm tham quan', icon: 'landmark' },
  { id: 'experience', label: 'Khám phá', icon: 'compass' },
  { id: 'food-drink', label: 'Ẩm thực', icon: 'utensils' },
  { id: 'shopping', label: 'Mua sắm', icon: 'shopping-bag' },
] as const satisfies readonly { id: string; label: string; icon: ImapCategoryIconId }[];

export type ImapCategory = typeof imapCategories[number];
export type ImapCategoryId = ImapCategory['id'];

/** Visitor taxonomy overlay; audit records and destination facts remain unchanged.
 * Metropole's former stay assignment is provisionally discovery, pending client approval.
 */
export function migrateImapCategory(value: string, destinationId?: string): string {
  if (destinationId === 'pho-sach-dinh-le') return 'shopping';
  return value === 'stay' ? 'experience' : value;
}

/** Reuse the content contract without changing production categories or migrating records. */
export type ImapDestinationRecord<
  Id extends string = DestinationId,
  City extends CityId = 'hanoi',
  RelatedIds extends string = DestinationId,
> = Omit<DestinationRecord<Id, City, RelatedIds>, 'category'> & {
  readonly category: ImapCategoryId;
};
