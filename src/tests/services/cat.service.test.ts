import { fetchCatBreeds, fetchCatBreedById, fetchCatbreedBySearch } from '../../services/cat.service';
import fetch from 'node-fetch';

jest.mock('node-fetch', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('cat.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function mockResponse(body: any, status: number = 200, statusText: string = 'OK') {
    return {
      ok: status >= 200 && status < 300,
      status,
      statusText,
      json: async () => body,
    } as Response;
  }

  describe('fetchCatBreeds', () => {
    it('should return list of breeds', async () => {
      const mockBreeds = [{ id: 'abys', name: 'Abyssinian' }];
      mockedFetch.mockResolvedValue(mockResponse(mockBreeds) as any);

      const result = await fetchCatBreeds();
      expect(result).toEqual(mockBreeds);
    });

    it('should throw on API error', async () => {
      mockedFetch.mockResolvedValue(mockResponse({}, 500, 'Server Error') as any);

      await expect(fetchCatBreeds()).rejects.toThrow('Failed to fetch cat breeds: Server Error');
    });
  });

  describe('fetchCatBreedById', () => {
    it('should return breed by id', async () => {
      const mockBreed = { id: 'abys', name: 'Abyssinian' };
      mockedFetch.mockResolvedValue(mockResponse(mockBreed) as any);

      const result = await fetchCatBreedById('abys');
      expect(result).toEqual(mockBreed);
    });

    it('should throw if breed not found', async () => {
      mockedFetch.mockResolvedValue(mockResponse({}, 404, 'Not Found') as any);

      await expect(fetchCatBreedById('invalid')).rejects.toThrow(
        'Failed to fetch cat breeds by id: Not Found'
      );
    });
  });

  describe('fetchCatbreedBySearch', () => {
    it('should return matching breeds', async () => {
      const mockResult = [{ id: 'siam', name: 'Siamese' }];
      mockedFetch.mockResolvedValue(mockResponse(mockResult) as any);

      const result = await fetchCatbreedBySearch('Siamese');
      expect(result).toEqual(mockResult);
    });

    it('should throw on fetch error', async () => {
      mockedFetch.mockResolvedValue(mockResponse({}, 400, 'Bad request') as any);

      await expect(fetchCatbreedBySearch('nope')).rejects.toThrow(
        'Failed to fetch cat breeds by id: Bad request'
      );
    });
  });
});
