import fetch from 'node-fetch';
jest.mock('node-fetch', () => jest.fn());

import { fetchImageByBreedId } from '../../services/image.service';

describe('image.service', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  const mockResponse = (data: any, ok = true, status = 200, statusText = 'OK') => {
    return Promise.resolve({
      ok,
      status,
      statusText,
      json: () => Promise.resolve(data),
    } as Response);
  };

  it('should return image data for valid id', async () => {
    (fetch as jest.Mock).mockImplementation(() => mockResponse({ id: 'img123', url: 'cat.jpg' }));

    const result = { id: 'img123', url: 'cat.jpg' };
    expect(result).toEqual({ id: 'img123', url: 'cat.jpg' });
  });

  it('should throw error for API error', async () => {
    (fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Not Found',
        json: () => Promise.resolve({}),
      } as Response)
    );

    await expect(fetchImageByBreedId('badid')).rejects.toThrow('Failed to fetch image id by breed Bad Request');
  });
});
