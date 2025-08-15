import { call, put, takeEvery } from 'redux-saga/effects'
import { supabase } from '../../services/supabase'
import { loginStart, loginFailure, logout } from '../slices/authSlice'

function* loginSaga(): Generator<any, void, any> {
  try {
    const { error } = yield call(
      [supabase.auth, 'signInWithOAuth'],
      {
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      }
    )

    if (error) {
      yield put(loginFailure(error.message))
    }
  } catch (error: any) {
    yield put(loginFailure(error.message))
  }
}

function* logoutSaga(): Generator<any, void, any> {
  try {
    yield call([supabase.auth, 'signOut'])
  } catch (error: any) {
    console.error('Logout error:', error)
  }
}

export default function* authSaga() {
  yield takeEvery(loginStart.type, loginSaga)
  yield takeEvery(logout.type, logoutSaga)
}
