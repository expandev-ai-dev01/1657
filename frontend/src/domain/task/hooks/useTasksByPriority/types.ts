import type { Priority, PriorityFilterPayload } from '../../types';

export interface UseTasksByPriorityOptions extends Partial<PriorityFilterPayload> {
  enabled?: boolean;
}
