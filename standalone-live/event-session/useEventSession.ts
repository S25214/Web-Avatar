import { useEffect, useState } from 'react';
import { doc, onSnapshot, type Firestore } from 'firebase/firestore';
import type { EventDocument, EventSession, EventSessionStatus } from './events';

const EVENT_KEY_PATTERN = /^[A-Za-z0-9_-]{8,128}$/;
const MAX_TIMEOUT_MS = 2_147_483_647;

function session(status: EventSessionStatus, event: EventDocument | null = null): EventSession {
  return {
    status,
    event,
    canAccess: status === 'active',
    isKickedOut: status !== 'active' && status !== 'checking',
  };
}

/**
 * Client-side access indicator for a dedicated kiosk Firestore database.
 * Render the kiosk only when canAccess is true and tear down its active media
 * and avatar sessions when isKickedOut becomes true.
 */
export function useEventSession(db: Firestore, eventKey: string | null | undefined): EventSession {
  const key = eventKey?.trim() ?? '';
  const [current, setCurrent] = useState<{ key: string; value: EventSession }>(() => ({
    key,
    value: session('checking'),
  }));

  useEffect(() => {
    const publish = (value: EventSession): void => setCurrent({ key, value });
    if (!EVENT_KEY_PATTERN.test(key)) {
      publish(session('invalid_key'));
      return;
    }

    let expiryTimer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
    publish(session('checking'));

    function scheduleExpiry(event: EventDocument): void {
      const remaining = event.expires_at.toMillis() - Date.now();
      if (remaining <= 0) {
        if (!disposed) publish(session('expired', event));
        return;
      }
      expiryTimer = setTimeout(() => scheduleExpiry(event), Math.min(remaining, MAX_TIMEOUT_MS));
    }

    const unsubscribe = onSnapshot(
      doc(db, 'events', key),
      { includeMetadataChanges: true },
      (snapshot) => {
        if (disposed) return;
        if (expiryTimer) clearTimeout(expiryTimer);
        expiryTimer = undefined;

        // A cached "active" value cannot confirm that the admin has not
        // deactivated the event while this device was disconnected.
        if (snapshot.metadata.fromCache) {
          publish(session('unavailable'));
          return;
        }
        if (!snapshot.exists()) {
          publish(session('not_found'));
          return;
        }

        const event = snapshot.data() as EventDocument;
        if (
          event.event_key !== key ||
          typeof event.is_active !== 'boolean' ||
          !event.expires_at ||
          typeof event.expires_at.toMillis !== 'function'
        ) {
          publish(session('unavailable'));
        } else if (!event.is_active) {
          publish(session('inactive', event));
        } else {
          scheduleExpiry(event);
          if (event.expires_at.toMillis() > Date.now()) {
            publish(session('active', event));
          }
        }
      },
      () => {
        if (!disposed) {
          if (expiryTimer) clearTimeout(expiryTimer);
          publish(session('unavailable'));
        }
      },
    );

    return () => {
      disposed = true;
      if (expiryTimer) clearTimeout(expiryTimer);
      unsubscribe();
    };
  }, [db, key]);

  // A new URL key must never expose the previous key's "active" snapshot,
  // including the render before React runs the replacement effect.
  return current.key === key ? current.value : session('checking');
}
