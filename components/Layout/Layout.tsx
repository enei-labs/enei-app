import { useAuth } from '@core/context/auth'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect } from 'react'
import Container from './Container'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter()
  const { status } = useAuth()

  useEffect(() => {
    if (status === 'authenticated') router.push('/')
  }, [router, status])

  return <Container>{children}</Container>
}

export default Layout
