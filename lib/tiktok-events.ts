declare global {
  interface Window {
    ttq?: {
      track: (event: string, properties?: Record<string, unknown>, options?: { event_id?: string }) => void;
    };
  }
}

export type TikTokStandardEvent =
  | "ViewContent"
  | "StartTrial"
  | "CompleteRegistration"
  | "InitiateCheckout"
  | "Purchase"
  | "Subscribe";

export interface TikTokEventProperties {
  content_ids?: string[];
  content_type?: "product" | "product_group";
  description?: string;
  quantity?: number;
  value?: number;
  currency?: string;
}

const ALLOWED_HOSTS = new Set(["pawnotes.top", "www.pawnotes.top"]);

function canSendTikTokEvent(): boolean {
  if (typeof window === "undefined") return false;
  if (process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ENABLED !== "true") return false;
  return ALLOWED_HOSTS.has(window.location.hostname);
}

export function buildTikTokEventId(prefix: string, stableId?: string): string {
  if (stableId) return `${prefix}_${stableId}`;
  return `${prefix}_${crypto.randomUUID()}`;
}

export function trackTikTokEvent(
  event: TikTokStandardEvent,
  properties: TikTokEventProperties = {},
  eventId?: string
): string | null {
  if (!canSendTikTokEvent()) return null;

  if (!window.ttq?.track) {
    console.warn(`[TikTok Pixel] ttq unavailable: ${event}`);
    return null;
  }

  const finalEventId = eventId ?? buildTikTokEventId(event.toLowerCase());
  window.ttq.track(event, properties as Record<string, unknown>, { event_id: finalEventId });
  return finalEventId;
}
