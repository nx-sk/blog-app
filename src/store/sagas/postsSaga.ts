import { call, put, takeEvery, select } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '../../services/supabase'
import { RootState } from '../index'
import {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  fetchPostStart,
  fetchPostSuccess,
  fetchPostFailure,
  createPostStart,
  createPostSuccess,
  createPostFailure,
  updatePostStart,
  updatePostSuccess,
  updatePostFailure,
  deletePostStart,
  deletePostSuccess,
  deletePostFailure,
} from '../slices/postsSlice'
import { Post } from '../../types'

function* fetchPostsSaga(): Generator<any, void, any> {
  try {
    const filters = yield select((state: RootState) => state.posts.filters)
    
    let query = supabase
      .from('posts')
      .select(`
        *,
        categories!posts_category_id_fkey(id, name, slug)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (filters.category) {
      query = query.eq('category_id', filters.category)
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
    }

    const from = (filters.page - 1) * filters.limit
    const to = from + filters.limit - 1

    const { data, error, count } = yield call(
      [query, 'range'],
      from,
      to
    )

    if (error) {
      yield put(fetchPostsFailure(error.message))
    } else {
      yield put(fetchPostsSuccess({
        posts: data || [],
        totalCount: count || 0,
      }))
    }
  } catch (error: any) {
    yield put(fetchPostsFailure(error.message))
  }
}

function* fetchPostSaga(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    const slug = action.payload
    
    const { data, error } = yield call(async () => {
      const result = await supabase
        .from('posts')
        .select(`
          *,
          categories!posts_category_id_fkey(id, name, slug)
        `)
        .eq('slug', slug)
        .single()
      return result
    })

    if (error) {
      yield put(fetchPostFailure(error.message))
    } else {
      yield put(fetchPostSuccess(data))
    }
  } catch (error: any) {
    yield put(fetchPostFailure(error.message))
  }
}

function* createPostSaga(action: PayloadAction<Omit<Post, 'id' | 'created_at' | 'updated_at'>>): Generator<any, void, any> {
  try {
    const { data, error } = yield call(
      [supabase.from('posts'), 'insert'],
      [action.payload]
    )

    if (error) {
      yield put(createPostFailure(error.message))
    } else {
      yield put(createPostSuccess(data[0]))
    }
  } catch (error: any) {
    yield put(createPostFailure(error.message))
  }
}

function* updatePostSaga(action: PayloadAction<{ id: number; updates: Partial<Post> }>): Generator<any, void, any> {
  try {
    const { id, updates } = action.payload
    
    const { data, error } = yield call(
      [supabase.from('posts').update(updates).eq('id', id), 'single']
    )

    if (error) {
      yield put(updatePostFailure(error.message))
    } else {
      yield put(updatePostSuccess(data))
    }
  } catch (error: any) {
    yield put(updatePostFailure(error.message))
  }
}

function* deletePostSaga(action: PayloadAction<number>): Generator<any, void, any> {
  try {
    const { error } = yield call(
      [supabase.from('posts').delete().eq('id', action.payload), 'single']
    )

    if (error) {
      yield put(deletePostFailure(error.message))
    } else {
      yield put(deletePostSuccess(action.payload))
    }
  } catch (error: any) {
    yield put(deletePostFailure(error.message))
  }
}

export default function* postsSaga() {
  yield takeEvery(fetchPostsStart.type, fetchPostsSaga)
  yield takeEvery(fetchPostStart.type, fetchPostSaga)
  yield takeEvery(createPostStart.type, createPostSaga)
  yield takeEvery(updatePostStart.type, updatePostSaga)
  yield takeEvery(deletePostStart.type, deletePostSaga)
}