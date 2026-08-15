import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const mockUseAuth = vi.fn()

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

import { useAuth } from '../contexts/AuthContext'

function renderProtected(
  route: string,
  allowedRoles?: ('OWNER' | 'WORKER' | 'PROPERTY_STAFF' | 'ADMIN')[],
) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/login" element={<div>login page</div>} />
        <Route path="/" element={<div>home page</div>} />
        <Route
          path="/protected"
          element={
            <ProtectedRoute allowedRoles={allowedRoles}>
              <div>protected content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

function setAuth({ isAuthenticated, role, isLoading }: { isAuthenticated: boolean; role: string | null; isLoading: boolean }) {
  mockUseAuth.mockReturnValue({
    user: null,
    token: null,
    isLoading,
    isAuthenticated,
    role: role as 'OWNER' | 'WORKER' | 'PROPERTY_STAFF' | 'ADMIN' | null,
    login: vi.fn(),
    logout: vi.fn(),
  })
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockUseAuth.mockReset()
  })

  it('shows loading state while auth is loading', () => {
    setAuth({ isAuthenticated: false, role: null, isLoading: true })
    renderProtected('/protected')
    expect(screen.getByText('加载中...')).toBeInTheDocument()
  })

  it('redirects unauthenticated users to login', () => {
    setAuth({ isAuthenticated: false, role: null, isLoading: false })
    renderProtected('/protected')
    expect(screen.getByText('login page')).toBeInTheDocument()
    expect(screen.queryByText('protected content')).not.toBeInTheDocument()
  })

  it('renders children for an authenticated user without role restriction', () => {
    setAuth({ isAuthenticated: true, role: 'OWNER', isLoading: false })
    renderProtected('/protected')
    expect(screen.getByText('protected content')).toBeInTheDocument()
  })

  it('allows a user whose role is in the allowed list', () => {
    setAuth({ isAuthenticated: true, role: 'ADMIN', isLoading: false })
    renderProtected('/protected', ['ADMIN', 'PROPERTY_STAFF'])
    expect(screen.getByText('protected content')).toBeInTheDocument()
  })

  it('redirects a user whose role is not allowed', () => {
    setAuth({ isAuthenticated: true, role: 'OWNER', isLoading: false })
    renderProtected('/protected', ['ADMIN', 'PROPERTY_STAFF'])
    expect(screen.queryByText('protected content')).not.toBeInTheDocument()
    expect(screen.getByText('home page')).toBeInTheDocument()
  })
})
