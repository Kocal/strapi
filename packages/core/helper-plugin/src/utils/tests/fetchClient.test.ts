import { server } from '@tests/utils';
import { rest } from 'msw';

import { auth } from '../auth';
import {
  instance
} from '../fetchClient';

const token = 'coolToken';
const mockClearAppStorage = jest.fn().mockImplementation();
const baseUrl = 'http://realurl';

auth.getToken = jest.fn().mockReturnValue(token);
auth.clearAppStorage = mockClearAppStorage;

describe('HELPER-PLUGIN | utils | fetchClient', () => {
  beforeAll(() => {
    server.listen();
  });
  
  afterEach(() => {
    server.resetHandlers();
  });
  
  afterAll(() => {
    server.close();
  });

  it('should add the authorization token in each request', async () => {
    server.use(
      rest.get('*/test-fetch-client', (req, res, ctx) => {
        return res(ctx.status(200));
      })
    )
    const response = await instance.get(`${baseUrl}/test-fetch-client`);
    expect(response.config.headers.Authorization).toBe(`Bearer ${token}`);
  })

  it('should contain a paramsSerializer that can serialize a params object to a string', async () => {
    server.use(
      rest.get('*/test-fetch-client', (req, res, ctx) => {
        return res(ctx.status(200));
      })
    )
    const mockParams = {
      page: '1',
      pageSize: '10',
      sort: 'short_text:ASC',
      filters: {
        $and: [
          {
            biginteger: {
              $eq: '3',
            },
          },
          {
            short_text: {
              $eq: 'test',
            },
          },
        ],
      },
      locale: 'en',
    };

    const response = await instance.get(`${baseUrl}/test-fetch-client`, { params: mockParams });
    expect(response.request.url).toBe(`${baseUrl}/test-fetch-client?page=1&pageSize=10&sort=short_text:ASC&filters[$and][0][biginteger][$eq]=3&filters[$and][1][short_text][$eq]=test&locale=en`);
  });

  it('should reload application if there is an error on the response', async () => {
    server.use(
      rest.get('*/test-fetch-client-error', (req, res, ctx) => {
        return res(ctx.status(401));
      })
    )

    const mockReload = jest.fn()
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: mockReload },
    })

    try {
      await instance.get(`${baseUrl}/test-fetch-client-error`)
    } catch (error) {
      expect(mockClearAppStorage).toHaveBeenCalled();
      expect(mockReload).toHaveBeenCalled();
    }
  })
  
});
