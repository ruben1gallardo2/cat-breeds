import fetch from 'node-fetch';
jest.mock('node-fetch', () => jest.fn());

import { getImageByBreedId } from '../../controllers/image.controller';
import { fetchCatBreedById } from '../../services/cat.service';
import { fetchImageByBreedId } from '../../services/image.service';

jest.mock('../../services/cat.service');
jest.mock('../../services/image.service');

describe('getImageByBreedId', () => {
  const mockReq = (id: string) => ({
    params: { id }
  } as any);
  
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
  
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    jest.clearAllMocks();
  });

  it('should return image if breed and image found', async () => {
    (fetchCatBreedById as jest.Mock).mockResolvedValue({
      name: 'Abyssinian',
      reference_image_id: 'img123'
    });
    (fetchImageByBreedId as jest.Mock).mockResolvedValue({ id: 'img123', url: 'cat.jpg' });

    const req = mockReq('abys');
    const res = mockRes();

    await getImageByBreedId(req, res);

    expect(fetchCatBreedById).toHaveBeenCalledWith('abys');
    expect(fetchImageByBreedId).toHaveBeenCalledWith('img123');
    expect(res.json).toHaveBeenCalledWith({ id: 'img123', url: 'cat.jpg' });
  });

  it('should return 400 if breed not found', async () => {
    (fetchCatBreedById as jest.Mock).mockResolvedValue(null);

    const req = mockReq('badid');
    const res = mockRes();

    await getImageByBreedId(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Breed not found' });
  });

  it('should return 400 if image not found', async () => {
    (fetchCatBreedById as jest.Mock).mockResolvedValue({
      name: 'Abyssinian',
      reference_image_id: 'img123'
    });
    (fetchImageByBreedId as jest.Mock).mockResolvedValue(undefined);

    const req = mockReq('abys');
    const res = mockRes();

    await getImageByBreedId(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Image for Breed: Abyssinian not found' });
  });

  it('should return 500 if fetchCatBreedById throws', async () => {
    (fetchCatBreedById as jest.Mock).mockRejectedValue(new Error('fail'));

    const req = mockReq('abys');
    const res = mockRes();

    await getImageByBreedId(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error while fetching from Third party' });
  });

  it('should return 500 if fetchImageByBreedId throws', async () => {
    (fetchCatBreedById as jest.Mock).mockResolvedValue({
      name: 'Abyssinian',
      reference_image_id: 'img123'
    });
    (fetchImageByBreedId as jest.Mock).mockRejectedValue(new Error('fail'));

    const req = mockReq('abys');
    const res = mockRes();

    await getImageByBreedId(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error while fetching from Third party images'});
  })
});