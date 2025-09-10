import { createAction, createReducer } from '@reduxjs/toolkit';
import type { ToDoStatus } from '../../types/types';
import type { AppState } from '../redux';

type FilterState = {
  filter: ToDoStatus;
};

const initialFilterState: FilterState = { filter: 'all' };

export const setFilter = createAction<{
  filter: ToDoStatus;
}>('filter/setFilter');

export const filterReducer = createReducer(initialFilterState, (builder) => {
  builder.addCase(setFilter, (state, action) => {
    state.filter = action.payload.filter;
  });
});

export const selectFilter = (state: AppState) => state.filter;
