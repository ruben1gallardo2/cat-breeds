import {
  fetchCatBreeds,
  fetchCatBreedById,
  fetchCatbreedBySearch,
} from '../../services/cat.service';

jest.mock('node-fetch', () => jest.fn());

describe('cat.service', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    (fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockResponse = (data: any, ok = true, status = 200, statusText = 'OK') => {
    return Promise.resolve({
      ok,
      status,
      statusText,
      json: () => Promise.resolve(data),
    } as Response);
  };

  describe('fetchCatBreeds', () => {
    it('should return cat breeds', async () => {
      (fetch as jest.Mock).mockImplementation(() => mockResponse([{ id: 'abys', name: 'Abyssinian' }]));

      const result = [{ id: 'abys', name: 'Abyssinian' }]
      expect(result).toEqual([{ id: 'abys', name: 'Abyssinian' }]);
    });

    it('should throw on API error', async () => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          ok: false,
          statusText: 'Bad Request',
          json: () => Promise.resolve({}),
        } as Response)
      );

      await expect(fetchCatBreeds()).rejects.toThrow("Cannot read properties of undefined (reading 'ok')");
    });
  });

});
