"use client"

import { useEffect } from 'react'
import { analytics } from '@/lib/firebase'
import { logEvent } from 'firebase/analytics'

export function useAnalytics() {
  useEffect(() => {
    // Log page view
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_title: 'Roast Compliment App',
        page_location: window.location.href
      })
    }
  }, [])

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (analytics) {
      logEvent(analytics, eventName, parameters)
    }
  }

  const trackRoastGeneration = (target?: string) => {
    trackEvent('roast_generated', {
      target: target || 'anonymous',
      timestamp: new Date().toISOString()
    })
  }

  const trackComplimentGeneration = (target?: string) => {
    trackEvent('compliment_generated', {
      target: target || 'anonymous',
      timestamp: new Date().toISOString()
    })
  }

  const trackModeSwitch = (newMode: 'roast' | 'compliment') => {
    trackEvent('mode_switched', {
      new_mode: newMode,
      timestamp: new Date().toISOString()
    })
  }

  const trackReaction = (messageType: 'roast' | 'compliment', reaction: 'like' | 'dislike') => {
    trackEvent('message_reaction', {
      message_type: messageType,
      reaction: reaction,
      timestamp: new Date().toISOString()
    })
  }

  const trackAILimitReached = () => {
    trackEvent('ai_limit_reached', {
      timestamp: new Date().toISOString()
    })
  }

  return {
    trackEvent,
    trackRoastGeneration,
    trackComplimentGeneration,
    trackModeSwitch,
    trackReaction,
    trackAILimitReached
  }
}
