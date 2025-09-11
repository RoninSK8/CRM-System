import { createAction, createReducer } from '@reduxjs/toolkit';
import type { ToDoStatus } from '../../types/types';
import type { AppState } from '../redux';

type FilterState = {
  selectedFilter: ToDoStatus;
};

const initialFilterState: FilterState = { selectedFilter: 'all' };

export const setFilter = createAction<{
  selectedFilter: ToDoStatus;
}>('filter/setFilter');

export const filterReducer = createReducer(initialFilterState, (builder) => {
  builder.addCase(setFilter, (state, action) => {
    state.selectedFilter = action.payload.selectedFilter;
  });
});

export const selectFilter = (state: AppState) => state.filter.selectedFilter;
