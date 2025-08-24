'use client'

import { useState, useEffect } from 'react'

interface UserSettings {
  username: string
  avatarType: 'user' | 'agent'
  customAvatar?: string
  agentAvatarType?: 'default' | 'custom'
  agentCustomAvatar?: string
  preferences: {
    notifications: boolean
    darkMode: boolean
    autoSave: boolean
    channels: Array<{ type: 'email' | 'telegram' | 'discord' | 'twitter'; value: string }>
  }
}

const DEFAULT_SETTINGS: UserSettings = {
  username: '',
  avatarType: 'user',
  agentAvatarType: 'default',
  preferences: {
    notifications: true,
    darkMode: true,
    autoSave: true,
    channels: []
  }
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('zensei-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        // Normalize legacy object channels to array form
        let normalizedChannels: Array<{ type: 'email' | 'telegram' | 'discord' | 'twitter'; value: string }> = []
        const legacy = parsed?.preferences?.channels
        if (Array.isArray(legacy)) {
          normalizedChannels = legacy
        } else if (legacy && typeof legacy === 'object') {
          for (const key of ['email', 'telegram', 'discord', 'twitter'] as const) {
            if (legacy[key]) normalizedChannels.push({ type: key, value: legacy[key] })
          }
        }
        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
          preferences: {
            ...DEFAULT_SETTINGS.preferences,
            ...parsed.preferences,
            channels: normalizedChannels,
          },
        })
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save settings to localStorage
  const saveSettings = (newSettings: UserSettings) => {
    try {
      localStorage.setItem('zensei-settings', JSON.stringify(newSettings))
      setSettings(newSettings)
      return true
    } catch (error) {
      console.error('Error saving settings:', error)
      return false
    }
  }

  const getUserAvatar = () => {
    if (settings.customAvatar) {
      return { type: 'custom' as const, image: settings.customAvatar }
    }
    return { type: settings.avatarType, image: null }
  }

  const getAgentAvatar = () => {
    if (settings.agentAvatarType === 'custom' && settings.agentCustomAvatar) {
      return { type: 'custom' as const, image: settings.agentCustomAvatar }
    }
    return { type: 'agent' as const, image: null }
  }

  return {
    settings,
    saveSettings,
    getUserAvatar,
    getAgentAvatar,
    isLoaded
  }
} 