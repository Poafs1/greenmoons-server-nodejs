import axios from 'axios';
import { moviesData } from './movies.mock';
import { configsData } from '../providers/configs.provider';

export const mockExternalMovieApi = jest.spyOn(axios, 'get').mockImplementation((url) => {
  if (url === configsData.movieApi) {
    return Promise.resolve({
      data: {
        movies: moviesData,
      },
      status: 200,
    });
  }

  return Promise.resolve({
    data: {
      //
    },
    status: 200,
  });
});
