import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { api } from '../../../Config/Api';
import type { HomeCategory } from '../../../types/homeDataTypes';
import type { HomePageContent } from '../../../types/homeContentTypes';

// Async thunk to fetch home page data with try-catch for error handling
export const fetchHomePageData = createAsyncThunk<HomePageContent>(
  'home/fetchHomePageData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/home-page');
      console.log("home page ",response.data)
      return response.data;
    } catch (error: any) {
      // Handle the error and return it to be used in rejected action
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch home page data';
      console.log("errr ",errorMessage,error)
      return rejectWithValue(errorMessage);
    }
  }
);

export const createHomeCategories = createAsyncThunk<HomePageContent | void, HomeCategory[]>(
  'home/createHomeCategories',
  async (homeCategories, { rejectWithValue }) => {
    try {
      const response = await api.post('/home/categories', homeCategories);
      console.log("home categories ",response.data)
      return response.data;
    } catch (error: any) {
      // Handle the error and return it to be used in rejected action
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create home categories';
      console.log("errr ",errorMessage,error)
      return rejectWithValue(errorMessage);
    }
  }
);
