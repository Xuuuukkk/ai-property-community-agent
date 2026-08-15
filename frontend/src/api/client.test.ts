import { describe, it, expect, beforeEach } from 'vitest'
import { setAuthToken, loadAuthToken } from './client'

describe('auth token management', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists the token to localStorage', () => {
    setAuthToken('abc123')
    expect(localStorage.getItem('property_agent_token')).toBe('abc123')
  })

  it('removes the token from localStorage when set to null', () => {
    setAuthToken('abc123')
    setAuthToken(null)
    expect(localStorage.getItem('property_agent_token')).toBeNull()
  })

  it('loads a stored token', () => {
    localStorage.setItem('property_agent_token', 'xyz789')
    expect(loadAuthToken()).toBe('xyz789')
  })

  it('returns null when no token is stored', () => {
    expect(loadAuthToken()).toBeNull()
  })
})
