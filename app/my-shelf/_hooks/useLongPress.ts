"use client";

import { useCallback, useRef, useState, type MouseEvent } from "react";

export const LONG_PRESS_MS = 500;
export const LONG_PRESS_INDICATOR_DELAY_MS = 150;

type UseLongPressOptions = {
  onLongPress: () => void;
  durationMs?: number;
  indicatorDelayMs?: number;
};

export function useLongPress({
  onLongPress,
  durationMs = LONG_PRESS_MS,
  indicatorDelayMs = LONG_PRESS_INDICATOR_DELAY_MS,
}: UseLongPressOptions) {
  const [showIndicator, setShowIndicator] = useState(false);
  const longPressTriggeredRef = useRef(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current !== null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const clearIndicatorTimer = useCallback(() => {
    if (indicatorTimerRef.current !== null) {
      clearTimeout(indicatorTimerRef.current);
      indicatorTimerRef.current = null;
    }
  }, []);

  const cancelPress = useCallback(() => {
    clearLongPressTimer();
    clearIndicatorTimer();
    setShowIndicator(false);
  }, [clearIndicatorTimer, clearLongPressTimer]);

  const onTouchStart = useCallback(() => {
    longPressTriggeredRef.current = false;
    clearLongPressTimer();
    clearIndicatorTimer();
    setShowIndicator(false);

    indicatorTimerRef.current = setTimeout(() => {
      setShowIndicator(true);
    }, indicatorDelayMs);

    longPressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      setShowIndicator(false);
      onLongPress();
    }, durationMs);
  }, [
    clearIndicatorTimer,
    clearLongPressTimer,
    durationMs,
    indicatorDelayMs,
    onLongPress,
  ]);

  const onTouchEnd = cancelPress;

  const onTouchMove = cancelPress;

  const onNavigateClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (longPressTriggeredRef.current) {
        event.preventDefault();
        longPressTriggeredRef.current = false;
      }
    },
    []
  );

  const longPressTouchHandlers = {
    onTouchStart,
    onTouchEnd,
    onTouchCancel: onTouchEnd,
    onTouchMove,
  };

  const indicatorGrowDurationMs = Math.max(
    durationMs - indicatorDelayMs,
    1
  );

  return {
    showIndicator,
    indicatorGrowDurationMs,
    longPressTouchHandlers,
    onNavigateClick,
  };
}
