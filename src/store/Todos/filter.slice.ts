import { createSlice } from '@reduxjs/toolkit';
import type { ToDoStatus } from '../../types/types';
import type { AppState } from '../redux';

type FilterState = {
  selectedFilter: ToDoStatus;
};

const initialState: FilterState = { selectedFilter: 'all' };

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.selectedFilter = action.payload.selectedFilter;
    },
  },
});

export const selectFilter = (state: AppState) => state.filter.selectedFilter;

export const { setFilter } = filterSlice.actions;

export default filterSlice.reducer;
