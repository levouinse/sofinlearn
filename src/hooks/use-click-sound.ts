import { useCallback } from 'react';
import { playSfx } from '@/lib/audioEngine';

export function useClickSound<T extends (...args: never[]) => void>(callback: T): T {
  return useCallback(((...args: Parameters<T>) => {
    playSfx('click');
    callback(...args);
  }) as T, [callback]);
}
