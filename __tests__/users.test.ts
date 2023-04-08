import supertest from 'supertest';
import nock from 'nock';
import { matchers } from 'jest-json-schema';
import getAuthenticatedUserFixture from '../fixtures/getAuthenticatedUser.json';
import updateAuthenticatedUserFixture from '../fixtures/updateAutheticatedUser.json';
import getAuthenticatedUserSchema from '../schemas/getAuthenticatedUser.json';
import updateAuthenticatedUserSchema from '../schemas/updateAuthenticatedUser.json';

expect.extend(matchers);

type headers = {
  Accept: string;
  Authorization?: string;
  'X-GitHub-Api-Version': string;
  'User-Agent': string;
};

const baseUrl: string = 'https://api.github.com';
const headers: headers = {
  Accept: 'application/vnd.github+json',
  Authorization: 'Bearer AccessToken',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'API tests',
};

describe('Users', () => {
  describe('get authenticated user', () => {
    const path: string = '/user';

    describe('given proper request is sent', () => {
      let res: supertest.Response;

      beforeAll(async () => {
        nock(baseUrl).get(path).reply(200, getAuthenticatedUserFixture);

        res = await supertest(baseUrl).get(path).set(headers);
      });

      it('should return a 200 status code', () => {
        expect(res.statusCode).toEqual(200);
      });

      it('should return a proper schema', () => {
        expect(res.body).toMatchSchema(getAuthenticatedUserSchema);
      });
    });

    describe('given no auth token is provided', () => {
      let res: supertest.Response;

      beforeEach(async () => {
        nock(baseUrl).get(path).reply(401, {
          message: 'Requires authentication',
          documentation_url:
            'https://docs.github.com/rest/reference/users#get-the-authenticated-user',
        });

        const { Authorization, ...headersNoAuth } = headers;
        res = await supertest(baseUrl).get(path).set(headersNoAuth);
      });

      it('should return 401 status code', () => {
        expect(res.statusCode).toEqual(401);
      });

      it('should return a proper err message', () => {
        const body = res.body;
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('documentation_url');
        expect(body.message).toEqual('Requires authentication');
        expect(body.documentation_url).toEqual(
          'https://docs.github.com/rest/reference/users#get-the-authenticated-user'
        );
      });
    });

    describe('given incorrect auth token is provided', () => {
      let res: supertest.Response;

      beforeEach(async () => {
        nock(baseUrl).get(path).reply(401, {
          message: 'Bad credentials',
          documentation_url: 'https://docs.github.com/rest',
        });

        const headersWrongAuth = {
          ...headers,
          Authorization: 'Bearer IncorrectToken',
        };
        res = await supertest(baseUrl).get(path).set(headersWrongAuth);
      });

      it('should return 401 status code', () => {
        expect(res.statusCode).toEqual(401);
      });

      it('should return a proper err message', () => {
        const body = res.body;
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('documentation_url');
        expect(body.message).toEqual('Bad credentials');
        expect(body.documentation_url).toEqual('https://docs.github.com/rest');
      });
    });
  });

  describe('update authenticated user', () => {
    const path: string = '/user';

    describe('given user name is being updated', () => {
      let res: supertest.Response;
      const updatedName = 'updatedName';

      beforeAll(async () => {
        const propToUpdate = { name: updatedName };
        const updatedNameFixture = {
          ...updateAuthenticatedUserFixture,
          ...propToUpdate,
        };

        nock(baseUrl).patch(path).reply(200, updatedNameFixture);

        res = await supertest(baseUrl)
          .patch(path)
          .set(headers)
          .send(propToUpdate);
      });

      it('should return a 200 status code', () => {
        expect(res.statusCode).toEqual(200);
      });

      it('should return updated user name', () => {
        expect(res.body.name).toEqual(updatedName);
      });

      it('should return a proper schema', () => {
        expect(res.body).toMatchSchema(updateAuthenticatedUserSchema);
      });
    });

    describe('given user email is being updated', () => {
      let res: supertest.Response;
      const updatedEmail = 'updatedEmail@gmail.com';

      beforeAll(async () => {
        const propToUpdate = { email: updatedEmail };
        const updatedEmailFixture = {
          ...updateAuthenticatedUserFixture,
          ...propToUpdate,
        };

        nock(baseUrl).patch(path).reply(200, updatedEmailFixture);

        res = await supertest(baseUrl)
          .patch(path)
          .set(headers)
          .send(propToUpdate);
      });

      it('should return a 200 status code', () => {
        expect(res.statusCode).toEqual(200);
      });

      it('should return updated user email', () => {
        expect(res.body.email).toEqual(updatedEmail);
      });

      it('should return a proper schema', () => {
        expect(res.body).toMatchSchema(getAuthenticatedUserSchema);
      });
    });

    describe('given blog url is being updated', () => {
      let res: supertest.Response;
      const updatedBlogUrl = 'https://updatedblogurl.com';

      beforeAll(async () => {
        const propToUpdate = { blog: updatedBlogUrl };
        const updatedBlogFixture = {
          ...updateAuthenticatedUserFixture,
          ...propToUpdate,
        };

        nock(baseUrl).patch(path).reply(200, updatedBlogFixture);

        res = await supertest(baseUrl)
          .patch(path)
          .set(headers)
          .send(propToUpdate);
      });

      it('should return a 200 status code', () => {
        expect(res.statusCode).toEqual(200);
      });

      it('should return updated blog url', () => {
        expect(res.body.blog).toEqual(updatedBlogUrl);
      });

      it('should return a proper schema', () => {
        expect(res.body).toMatchSchema(updateAuthenticatedUserSchema);
      });
    });

    describe('given several properties are being updated', () => {
      let res: supertest.Response;
      const updatedName = 'updatedName';
      const updatedEmail = 'updatedEmail@gmail.com';
      const updatedBlogUrl = 'https://updatedblogurl.com';
      const updatedTwitterUsername: string = 'UpdatedTwitterUsername';
      const updatedCompany: string = 'UpdatedCompanyName';
      const updatedLocation: string = 'UpdatedLocation';
      const updatedHireable: boolean = true;
      const updatedBio: string = 'Updated bio of the user...';

      beforeAll(async () => {
        const propsToUpdate = {
          name: updatedName,
          email: updatedEmail,
          blog: updatedBlogUrl,
          twitter_username: updatedTwitterUsername,
          company: updatedCompany,
          location: updatedLocation,
          hireable: updatedHireable,
          bio: updatedBio,
        };
        const updatedMultiplePropsFixture = {
          ...updateAuthenticatedUserFixture,
          ...propsToUpdate,
        };

        nock(baseUrl).patch(path).reply(200, updatedMultiplePropsFixture);

        res = await supertest(baseUrl)
          .patch(path)
          .set(headers)
          .send(propsToUpdate);
      });

      it('should return a 200 status code', () => {
        expect(res.statusCode).toEqual(200);
      });

      it('should return updated props', () => {
        const body = res.body;
        expect(body.name).toEqual(updatedName);
        expect(body.email).toEqual(updatedEmail);
        expect(body.blog).toEqual(updatedBlogUrl);
        expect(body.twitter_username).toEqual(updatedTwitterUsername);
        expect(body.company).toEqual(updatedCompany);
        expect(body.location).toEqual(updatedLocation);
        expect(body.hireable).toEqual(updatedHireable);
        expect(body.bio).toEqual(updatedBio);
      });

      it('should return a proper schema', () => {
        expect(res.body).toMatchSchema(updateAuthenticatedUserSchema);
      });
    });

    describe('given unexpected prop is attached to payload', () => {
      let res: supertest.Response;
      const updatedName = 'updatedName';
      const unexpectedProp = { unexpectedProp: 'UnexpectedProp' };

      beforeAll(async () => {
        const propToUpdate = { name: updatedName };
        const unexpectedPropFixture = {
          ...updateAuthenticatedUserFixture,
          ...propToUpdate,
        };

        nock(baseUrl).patch(path).reply(200, unexpectedPropFixture);

        res = await supertest(baseUrl)
          .patch(path)
          .set(headers)
          .send({ ...propToUpdate, ...unexpectedProp });
      });

      it('should return 200 status code', () => {
        expect(res.statusCode).toEqual(200);
      });

      it('should ignore the unexpected prop and return updated user name', () => {
        expect(res.body.name).toEqual(updatedName);
      });

      it('should return a proper schema', () => {
        expect(res.body).toMatchSchema(updateAuthenticatedUserSchema);
      });
    });

    describe('given no payload is provided', () => {
      let res: supertest.Response;

      beforeAll(async () => {
        nock(baseUrl).patch(path).reply(200, updateAuthenticatedUserFixture);

        res = await supertest(baseUrl).patch(path).set(headers);
      });

      it('should return a 200 status code', () => {
        expect(res.statusCode).toEqual(200);
      });

      it('should return the user data without any change', () => {
        expect(res.body).toEqual(updateAuthenticatedUserFixture);
      });

      it('should return a proper schema', () => {
        expect(res.body).toMatchSchema(updateAuthenticatedUserSchema);
      });
    });

    describe('given patch payload contains incorrect data type', () => {
      let res: supertest.Response;

      beforeAll(async () => {
        // given non-boolean type is provided, hireable becomes true
        // I don't think this is a proper behaviour but this is how the real API responds
        const updatedHireableFixture = {
          ...updateAuthenticatedUserFixture,
          hireable: true,
        };

        nock(baseUrl).patch(path).reply(200, updatedHireableFixture);

        res = await supertest(baseUrl).patch(path).set(headers).send({
          hireable: 'updatedHireable', // Expected to be boolean
        });
      });

      it('should return a 200 status code', () => {
        expect(res.statusCode).toEqual(200);
      });

      it('should return hireable as true', () => {
        expect(res.body.hireable).toBe(true);
      });

      it('should return a proper schema', () => {
        expect(res.body).toMatchSchema(getAuthenticatedUserSchema);
      });
    });

    describe('given no auth token is provided', () => {
      let res: supertest.Response;

      beforeEach(async () => {
        nock(baseUrl).patch(path).reply(401, {
          message: 'Requires authentication',
          documentation_url:
            'https://docs.github.com/rest/reference/users#get-the-authenticated-user',
        });

        const { Authorization, ...headers_no_auth } = headers;
        res = await supertest(baseUrl)
          .patch(path)
          .set(headers_no_auth)
          .send({ name: 'UpdatedName' });
      });

      it('should return 401 status code', () => {
        expect(res.statusCode).toEqual(401);
      });

      it('should return a proper err message', () => {
        const body = res.body;
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('documentation_url');
        expect(body.message).toEqual('Requires authentication');
        expect(body.documentation_url).toEqual(
          'https://docs.github.com/rest/reference/users#get-the-authenticated-user'
        );
      });
    });

    describe('given incorrect auth token is provided', () => {
      let res: supertest.Response;

      beforeEach(async () => {
        nock(baseUrl).patch(path).reply(401, {
          message: 'Bad credentials',
          documentation_url: 'https://docs.github.com/rest',
        });

        const headers_wrong_auth = {
          ...headers,
          Authorization: 'Bearer IncorrectToken',
        };
        res = await supertest(baseUrl)
          .patch(path)
          .set(headers_wrong_auth)
          .send({ name: 'UpdatedName' });
      });

      it('should return 401 status code', () => {
        expect(res.statusCode).toEqual(401);
      });

      it('should return a proper err message', () => {
        const body = res.body;
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('documentation_url');
        expect(body.message).toEqual('Bad credentials');
        expect(body.documentation_url).toEqual('https://docs.github.com/rest');
      });
    });
  });
});
