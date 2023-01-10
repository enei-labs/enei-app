import client from '@core/graphql'
import { ME } from '@core/graphql/queries'
import { Admin } from '@core/graphql/types'
import { useQuery, useSignOut } from '@utils/hooks'
import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { reducer } from './reducer'

interface AuthState {
  me?: Admin
  logIn: () => Promise<void>
  logOut: () => Promise<void>
  status: 'loading' | 'authenticated' | 'unauthenticated'
}

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthContext = createContext({} as AuthState)

export const useAuth = (): AuthState => useContext(AuthContext)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { status: 'loading' })

  const { data, refetch } = useQuery<{ me: Admin }>(ME, {
    pollInterval: 3600000,
    onError: () => {
      dispatch({ type: 'unauthenticated' })
    },
  })

  const [signOut] = useSignOut()

  const logIn = async () => {
    await refetch()
  }

  const logOut = async () => {
    await signOut({
      update: () => client.clearStore(),
      onCompleted: () => dispatch({ type: 'unauthenticated' }),
    })
  }

  useEffect(() => {
    const me = data?.me

    if (me === undefined) {
      return
    }

    if (me === null || me.hasSetPassword === false) {
      dispatch({ type: 'unauthenticated' })
      return
    }

    me.__typename === 'Admin'
      ? dispatch({ type: 'authenticated', payload: me })
      : dispatch({ type: 'unauthenticated' })
  }, [data])

  return (
    <AuthContext.Provider
      value={{
        me: state.me,
        logIn,
        logOut,
        status: state.status,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
