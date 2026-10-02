import type { Timestamp } from 'firebase/firestore';

/** Document path: events/{event_key}. The key in the URL is the document ID. */
export interface EventDocument {
  event_key: string;
  is_active: boolean;
  expires_at: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
  deactivated_at: Timestamp | null;
  // Public-facing metadata only: anyone with the event key can read this document.
  display_name: string;
}

export type EventSessionStatus =
  | 'checking'
  | 'active'
  | 'inactive'
  | 'expired'
  | 'not_found'
  | 'unavailable'
  | 'invalid_key';

export interface EventSession {
  status: EventSessionStatus;
  event: EventDocument | null;
  isKickedOut: boolean;
  canAccess: boolean;
}
