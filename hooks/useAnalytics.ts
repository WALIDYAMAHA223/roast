import { useCallback } from 'react'
import type { AnalyticsEvent } from '@/lib/types'

export function useAnalytics() {
  const track = useCallback((action: AnalyticsEvent['action'], data?: Record<string, any>) => {
    const event: AnalyticsEvent = {
      action,
      data,
      timestamp: Date.now()
    }
    
    // Pour l'instant, on log en console
    // Plus tard, on pourra intégrer Google Analytics, Mixpanel, etc.
    console.log('Analytics Event:', event)
    
    // TODO: Envoyer vers un service d'analytics externe
    // analytics.track(action, data)
  }, [])

  return { track }
}




