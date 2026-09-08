import { useEffect } from 'react'
import { supabase } from '@/shared/lib/supabaseClient'
import { useAppDispatch } from '@/shared/lib/hooks'
import { setAuthenticated, setStaffProfile, setUnauthenticated, setAuthLoading } from '../state/authSlice'
import { authApi } from '../api/authApi'

export function AuthListener({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setAuthLoading())

    supabase.auth.getSession().then(({ data }) => {
      const session = data.session
      if (session?.user) {
        dispatch(setAuthenticated({ userId: session.user.id, email: session.user.email ?? '' }))
        dispatch(authApi.endpoints.getStaffProfile.initiate(session.user.id))
          .unwrap()
          .then((profile) => dispatch(setStaffProfile(profile)))
      } else {
        dispatch(setUnauthenticated())
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(setAuthenticated({ userId: session.user.id, email: session.user.email ?? '' }))
        dispatch(authApi.endpoints.getStaffProfile.initiate(session.user.id))
          .unwrap()
          .then((profile) => dispatch(setStaffProfile(profile)))
      } else {
        dispatch(setUnauthenticated())
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [dispatch])

  return <>{children}</>
}
