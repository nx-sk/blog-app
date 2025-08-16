import { call, put, takeEvery, select } from 'redux-saga/effects'
import { supabase } from '../../services/supabase'
import {
  fetchSettingsStart,
  fetchSettingsSuccess,
  fetchSettingsFailure,
  updateSettingsStart,
  updateSettingsSuccess,
  updateSettingsFailure,
  SiteSettings,
} from '../slices/settingsSlice'
import { RootState } from '../index'

function* fetchSettingsSaga(): Generator<any, void, any> {
  try {
    // Try load single row; create default if none
    const { data, error } = yield call(async () => {
      const res = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle()
      return res
    })

    if (error) {
      yield put(fetchSettingsFailure(error.message))
      return
    }

    let row: SiteSettings | null = data

    if (!row) {
      const defaults: SiteSettings = {
        header_brand: 'Digital Atelier',
        header_subtitle: '',
        sidebar_title: 'Digital Atelier',
        sidebar_description:
          'フルスタックにものづくりを楽しむ個人ブログ。設計メモや実験的な実装の備忘録を中心に更新しています。',
        social_links: [],
      }
      const { data: inserted, error: insertError } = yield call(async () => {
        const res = await supabase.from('site_settings').insert(defaults).select('*').single()
        return res
      })
      if (insertError) {
        yield put(fetchSettingsFailure(insertError.message))
        return
      }
      row = inserted
    }

    yield put(fetchSettingsSuccess(row))
  } catch (e: any) {
    yield put(fetchSettingsFailure(e.message))
  }
}

function* updateSettingsSaga(action: { type: string; payload: Partial<SiteSettings> }): Generator<any, void, any> {
  try {
    const current: SiteSettings | null = yield select((state: RootState) => state.settings.data)
    const updates = action.payload

    if (!current || !current.id) {
      // No row yet, insert
      const { data, error } = yield call(async () => {
        const res = await supabase.from('site_settings').insert(updates).select('*').single()
        return res
      })
      if (error) {
        yield put(updateSettingsFailure(error.message))
        return
      }
      yield put(updateSettingsSuccess(data))
      return
    }

    const { data, error } = yield call(async () => {
      const res = await supabase
        .from('site_settings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', current.id as number)
        .select('*')
        .single()
      return res
    })
    if (error) {
      yield put(updateSettingsFailure(error.message))
      return
    }
    yield put(updateSettingsSuccess(data))
  } catch (e: any) {
    yield put(updateSettingsFailure(e.message))
  }
}

export default function* settingsSaga() {
  yield takeEvery(fetchSettingsStart.type, fetchSettingsSaga)
  yield takeEvery(updateSettingsStart.type, updateSettingsSaga)
}

