'use client'

import { useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/chat/Avatar'
import { User, Save, Check, X, Upload, Trash2, ChevronDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface UserSettings {
  username: string
  avatarType: 'user' | 'agent'
  customAvatar?: string // Base64 image data for user
  agentAvatarType?: 'default' | 'custom'
  agentCustomAvatar?: string // Base64 image data for agent
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

export function SettingsForm() {
  const { user, authenticated } = usePrivy()
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [tempUsername, setTempUsername] = useState('')
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errors, setErrors] = useState<{ username?: string; avatar?: string }>({})
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isUploadingAgentAvatar, setIsUploadingAgentAvatar] = useState(false)
  const [channelError, setChannelError] = useState<string | null>(null)
  const [newChannelType, setNewChannelType] = useState<'email' | 'telegram' | 'discord' | 'twitter'>('email')
  const [newChannelValue, setNewChannelValue] = useState('')

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('zensei-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        // Normalize legacy channels object → array
        let normalizedChannels: Array<{ type: 'email' | 'telegram' | 'discord' | 'twitter'; value: string }> = []
        const legacy = parsed?.preferences?.channels
        if (Array.isArray(legacy)) {
          normalizedChannels = legacy
        } else if (legacy && typeof legacy === 'object') {
          ;(['email','telegram','discord','twitter'] as const).forEach((k) => { if (legacy[k]) normalizedChannels.push({ type: k, value: legacy[k] as string }) })
        }
        const merged: UserSettings = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          preferences: {
            ...DEFAULT_SETTINGS.preferences,
            ...parsed.preferences,
            channels: normalizedChannels,
          },
        }
        setSettings(merged)
        setTempUsername(merged.username || '')
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    } else if (user?.wallet?.address) {
      // Default username from wallet address
      const defaultUsername = `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
      setSettings(prev => ({ ...prev, username: defaultUsername }))
      setTempUsername(defaultUsername)
    }
  }, [user])

  // Save settings to localStorage
  const saveSettings = (newSettings: UserSettings) => {
    try {
      localStorage.setItem('zensei-settings', JSON.stringify(newSettings))
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  // Validate username
  const validateUsername = (username: string): string | null => {
    if (!username.trim()) return 'Username is required'
    if (username.length < 3) return 'Username must be at least 3 characters'
    if (username.length > 20) return 'Username must be less than 20 characters'
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) return 'Username can only contain letters, numbers, _ and -'
    return null
  }

  // Handle username save
  const handleUsernameSave = () => {
    const error = validateUsername(tempUsername)
    if (error) {
      setErrors({ username: error })
      return
    }
    
    setErrors({})
    setSaveStatus('saving')
    const newSettings = { ...settings, username: tempUsername }
    setSettings(newSettings)
    saveSettings(newSettings)
    setIsEditingUsername(false)
  }

  // Handle username cancel
  const handleUsernameCancel = () => {
    setTempUsername(settings.username)
    setIsEditingUsername(false)
    setErrors({})
  }

  // (removed unused handleAvatarChange)

  // Handle preference toggle
  const handlePreferenceToggle = (key: keyof UserSettings['preferences']) => {
    setSaveStatus('saving')
    const newSettings = {
      ...settings,
      preferences: {
        ...settings.preferences,
        [key]: !settings.preferences[key]
      }
    }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  // Handle custom avatar upload
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ avatar: 'Please select an image file' })
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors({ avatar: 'Image must be less than 2MB' })
      return
    }

    setIsUploadingAvatar(true)
    setErrors({})

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      setSaveStatus('saving')
      const newSettings = {
        ...settings,
        customAvatar: base64,
        avatarType: 'user' as const // Switch to user type when custom image is uploaded
      }
      setSettings(newSettings)
      saveSettings(newSettings)
      setIsUploadingAvatar(false)
    }

    reader.onerror = () => {
      setErrors({ avatar: 'Failed to read image file' })
      setIsUploadingAvatar(false)
    }

    reader.readAsDataURL(file)
  }

  function normalizeChannelValue(type: 'email' | 'telegram' | 'discord' | 'twitter', raw: string): string {
    let value = raw.trim()
    if (type === 'telegram' || type === 'twitter') {
      if (!value.startsWith('@')) value = `@${value}`
    }
    return value
  }

  function validateChannelValue(type: 'email' | 'telegram' | 'discord' | 'twitter', raw: string): string | null {
    const value = raw.trim()
    if (!value) return 'Value is required'
    switch (type) {
      case 'email': {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(value) ? null : 'Invalid email address'
      }
      case 'telegram': {
        const re = /^@?[a-zA-Z0-9_]{5,32}$/
        return re.test(value) ? null : 'Telegram handle must be 5-32 chars (letters, numbers, underscore)'
      }
      case 'twitter': {
        const re = /^@?[A-Za-z0-9_]{1,15}$/
        return re.test(value) ? null : 'Twitter handle must be up to 15 chars (letters, numbers, underscore)'
      }
      case 'discord': {
        const legacy = /^.{2,32}#\d{4}$/
        const modern = /^[A-Za-z0-9._]{2,32}$/
        return legacy.test(value) || modern.test(value) ? null : 'Discord username must be username#1234 or modern username'
      }
      default:
        return null
    }
  }

  // Handle avatar removal
  const handleRemoveCustomAvatar = () => {
    setSaveStatus('saving')
    const { customAvatar, ...settingsWithoutAvatar } = settings
    setSettings(settingsWithoutAvatar as UserSettings)
    saveSettings(settingsWithoutAvatar as UserSettings)
  }

  if (!authenticated) {
    return (
      <Card className="glass-card border-border/50">
        <CardContent className="p-8 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-display font-normal mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Connect your wallet to access settings and customize your experience.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Save Status */}
      {saveStatus !== 'idle' && (
        <div className={cn(
          'p-3 rounded-lg flex items-center gap-3 transition-all duration-300',
          saveStatus === 'saved' && 'bg-green-500/10 border border-green-500/20',
          saveStatus === 'saving' && 'bg-blue-500/10 border border-blue-500/20',
          saveStatus === 'error' && 'bg-red-500/10 border border-red-500/20'
        )}>
          {saveStatus === 'saved' && <Check className="h-4 w-4 text-green-400" />}
          {saveStatus === 'saving' && <div className="h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />}
          {saveStatus === 'error' && <X className="h-4 w-4 text-red-400" />}
          <span className={cn(
            'text-sm',
            saveStatus === 'saved' && 'text-green-400',
            saveStatus === 'saving' && 'text-blue-400',
            saveStatus === 'error' && 'text-red-400'
          )}>
            {saveStatus === 'saved' && 'Settings saved successfully!'}
            {saveStatus === 'saving' && 'Saving settings...'}
            {saveStatus === 'error' && 'Error saving settings. Please try again.'}
          </span>
        </div>
      )}

      {/* Profile Settings */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            {isEditingUsername ? (
              <div className="grid grid-cols-1 sm:grid-cols-[auto,1fr,auto] items-center gap-3 p-3 border border-border/40 rounded-xl bg-white/5">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Username</div>
                <Input
                  value={tempUsername}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempUsername(e.target.value)}
                  placeholder="Enter username"
                  className="flex-1"
                                     onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleUsernameSave()}
                />
                <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleUsernameSave} disabled={saveStatus === 'saving'}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleUsernameCancel}>
                  <X className="h-4 w-4" />
                </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-[auto,1fr,auto] items-center gap-3 p-3 border border-border/40 rounded-xl bg-white/5">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Username</div>
                <div className="text-foreground/90 bg-background/50 border border-border/40 rounded-lg px-3 py-2">
                  {settings.username || 'Not set'}
                </div>
                <Button size="sm" variant="outline" onClick={() => setIsEditingUsername(true)}>
                  Edit
                </Button>
              </div>
            )}
            {errors.username && (
              <p className="text-sm text-red-400">{errors.username}</p>
            )}
          </div>

          {/* Avatar Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Avatar */}
            <div className="space-y-3 rounded-2xl border border-border/40 bg-white/5 p-4 sm:p-5 shadow-sm">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">User avatar</label>
              <div className="h-px bg-border/30" />
              <div className="flex items-center justify-center p-5 border border-border/40 rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 shadow-sm">
              <div className="flex flex-col items-center gap-3">
                {settings.customAvatar ? (
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zen-purple">
                        <Image src={settings.customAvatar} alt="Custom avatar" width={64} height={64} className="w-full h-full object-cover" unoptimized />
                    </div>
                      <Button variant="outline" size="sm" onClick={handleRemoveCustomAvatar} className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500/10 border-red-500/20 hover:bg-red-500/20">
                      <Trash2 className="h-3 w-3 text-red-400" />
                    </Button>
                  </div>
                ) : (
                    <Avatar type="user" size="lg" />
                )}
                  <span className="text-xs text-muted-foreground">{settings.customAvatar ? 'Custom Image' : 'Default User Style'}</span>
              </div>
            </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className={cn('p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 bg-white/5 hover:bg-white/10 hover:ring hover:ring-zen-purple/20 shadow-sm', !settings.customAvatar ? 'border-zen-purple' : 'border-border/50')} onClick={handleRemoveCustomAvatar}>
                <div className="flex flex-col items-center gap-2">
                  <Avatar type="user" size="md" />
                    <span className="text-xs text-muted-foreground">Use default</span>
                  </div>
                </div>
                <div className="p-4 border-2 border-dashed border-border/50 rounded-xl bg-white/5 hover:border-zen-green/50 hover:bg-white/10 transition-all duration-200 shadow-sm">
                  <label className="flex flex-col items-center gap-2 cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={isUploadingAvatar} className="hidden" />
                    <div className="w-8 h-8 rounded-lg bg-zen-green/10 border border-zen-green/20 flex items-center justify-center">{isUploadingAvatar ? (<div className="w-4 h-4 border-2 border-zen-green border-t-transparent rounded-full animate-spin" />) : (<Upload className="h-4 w-4 text-zen-green" />)}</div>
                    <span className="text-xs text-muted-foreground text-center">Upload image</span>
                  </label>
                </div>
                </div>
              </div>

            {/* Agent Avatar */}
            <div className="space-y-3 rounded-2xl border border-border/40 bg-white/5 p-4 sm:p-5 shadow-sm">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Agent avatar</label>
              <div className="h-px bg-border/30" />
              <div className="flex items-center justify-center p-5 border border-border/40 rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 shadow-sm">
                <div className="flex flex-col items-center gap-3">
                  {settings.agentAvatarType === 'custom' && settings.agentCustomAvatar ? (
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zen-cyan">
                        <Image src={settings.agentCustomAvatar} alt="Agent custom avatar" width={64} height={64} className="w-full h-full object-cover" unoptimized />
                      </div>
                      <Button variant="outline" size="sm" onClick={() => { setSaveStatus('saving'); const newSettings: UserSettings = { ...settings, agentAvatarType: 'default', agentCustomAvatar: '' as unknown as string }; setSettings(newSettings); saveSettings(newSettings) }} className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500/10 border-red-500/20 hover:bg-red-500/20">
                        <Trash2 className="h-3 w-3 text-red-400" />
                      </Button>
                    </div>
                  ) : (
                    <Avatar type="agent" size="lg" />
                  )}
                  <span className="text-xs text-muted-foreground">{settings.agentAvatarType === 'custom' ? 'Custom Image' : 'Default Agent Style'}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className={cn('p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 bg-white/5 hover:bg-white/10 hover:ring hover:ring-zen-cyan/20 shadow-sm', settings.agentAvatarType !== 'custom' ? 'border-zen-cyan' : 'border-border/50')} onClick={() => { setSaveStatus('saving'); const newSettings: UserSettings = { ...settings, agentAvatarType: 'default', agentCustomAvatar: '' as unknown as string }; setSettings(newSettings); saveSettings(newSettings) }}>
                <div className="flex flex-col items-center gap-2">
                  <Avatar type="agent" size="md" />
                    <span className="text-xs text-muted-foreground">Use default</span>
                </div>
              </div>
                <div className="p-4 border-2 border-dashed border-border/50 rounded-xl bg-white/5 hover:border-zen-green/50 hover:bg-white/10 transition-all duration-200 shadow-sm">
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                    <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; if (!file.type.startsWith('image/')) { setErrors({ avatar: 'Please select an image file' }); return } if (file.size > 2 * 1024 * 1024) { setErrors({ avatar: 'Image must be less than 2MB' }); return } setIsUploadingAgentAvatar(true); const reader = new FileReader(); reader.onload = (ev) => { const base64 = ev.target?.result as string; setSaveStatus('saving'); const newSettings: UserSettings = { ...settings, agentAvatarType: 'custom', agentCustomAvatar: base64 }; setSettings(newSettings); saveSettings(newSettings); setIsUploadingAgentAvatar(false) }; reader.onerror = () => { setErrors({ avatar: 'Failed to read image file' }); setIsUploadingAgentAvatar(false) }; reader.readAsDataURL(file) }} disabled={isUploadingAgentAvatar} className="hidden" />
                    <div className="w-8 h-8 rounded-lg bg-zen-green/10 border border-zen-green/20 flex items-center justify-center">{isUploadingAgentAvatar ? (<div className="w-4 h-4 border-2 border-zen-green border-t-transparent rounded-full animate-spin" />) : (<Upload className="h-4 w-4 text-zen-green" />)}</div>
                    <span className="text-xs text-muted-foreground text-center">Upload image</span>
                </label>
                </div>
              </div>
            </div>

          </div>
          {errors.avatar && (<p className="text-sm text-red-400">{errors.avatar}</p>)}
        </CardContent>
      </Card>

      {/* User Preferences */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Notifications */}
          <div className="space-y-3 rounded-2xl border border-border/40 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-foreground">Notifications</h4>
                <p className="text-xs text-muted-foreground">Receive notifications for transactions and when automations execute</p>
            </div>
            <Button
              variant={settings.preferences.notifications ? "default" : "outline"}
              size="sm"
              onClick={() => handlePreferenceToggle('notifications')}
            >
              {settings.preferences.notifications ? 'On' : 'Off'}
            </Button>
            </div>

            {settings.preferences.notifications && (
              <div className="space-y-3">
                {/* Existing channels list */}
                {Array.isArray(settings.preferences.channels) && settings.preferences.channels.length > 0 && (
                  <div className="space-y-2">
                    {settings.preferences.channels.map((ch, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-xl border border-border/40 bg-white/5 px-3 py-2">
                        <span className="text-sm text-muted-foreground uppercase">{ch.type}</span>
                        <span className="text-sm text-foreground/90">{ch.value}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => {
                            const value = prompt(`Edit ${ch.type}`, ch.value) || ch.value
                            const channels = [...settings.preferences.channels]
                            channels[idx] = { ...ch, value }
                            const newSettings: UserSettings = { ...settings, preferences: { ...settings.preferences, channels } }
                            setSaveStatus('saving'); setSettings(newSettings); saveSettings(newSettings)
                          }}>Edit</Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            const channels = settings.preferences.channels.filter((_, i) => i !== idx)
                            const newSettings: UserSettings = { ...settings, preferences: { ...settings.preferences, channels } }
                            setSaveStatus('saving'); setSettings(newSettings); saveSettings(newSettings)
                          }}>Remove</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new channel */}
                <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto] gap-2 items-center">
                  <div className="grid grid-cols-5 items-center gap-2">
                    <div className="col-span-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="w-full flex items-center justify-between rounded-lg border border-border/40 bg-background/60 px-3 py-2 text-sm text-foreground hover:border-zen-purple/30 focus:outline-none focus:ring-2 focus:ring-zen-purple/30">
                            <span className="capitalize">{newChannelType}</span>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-lg border border-border/40 bg-background/95 backdrop-blur-md p-1">
                          {(['email','telegram','discord','twitter'] as const).map((t) => (
                            <DropdownMenuItem key={t} onClick={() => setNewChannelType(t)} className="capitalize">
                              {t}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Input value={newChannelValue} onChange={(e) => setNewChannelValue(e.target.value)} className="col-span-3" placeholder="Insert here" />
                  </div>
                  <Button size="sm" onClick={() => {
                    setChannelError(null)
                    const error = validateChannelValue(newChannelType, newChannelValue)
                    if (error) { setChannelError(error); return }
                    const value = normalizeChannelValue(newChannelType, newChannelValue)
                    const channels = [...(settings.preferences.channels || []), { type: newChannelType, value }]
                    const newSettings: UserSettings = { ...settings, preferences: { ...settings.preferences, channels } }
                    setSaveStatus('saving'); setSettings(newSettings); saveSettings(newSettings)
                    setNewChannelValue('')
                  }}>Add</Button>
                </div>
                {channelError && <p className="text-xs text-red-400">{channelError}</p>}
              </div>
            )}
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-foreground">Dark Mode</h4>
              <p className="text-xs text-muted-foreground">Use dark theme (currently always enabled)</p>
            </div>
            <Badge variant="outline">Always On</Badge>
          </div>

          {/* Auto Save */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-foreground">Auto Save Chat</h4>
              <p className="text-xs text-muted-foreground">Automatically save chat history to local storage</p>
            </div>
            <Button
              variant={settings.preferences.autoSave ? "default" : "outline"}
              size="sm"
              onClick={() => handlePreferenceToggle('autoSave')}
            >
              {settings.preferences.autoSave ? 'On' : 'Off'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Info */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Wallet Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Connected Address</span>
              <span className="text-sm font-mono text-foreground">
                {user?.wallet?.address ? 
                  `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : 
                  'Not connected'
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 