# GitHub API Jest tests

The repository stores a showcase of API test automation using [GitHub API](https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28).  
The tests are written in node & jest & supertest.  
All tests are being mocked using [nock](https://www.npmjs.com/package/nock) library which means there are no real network calls.

## Requirements

Make sure you install the below dependencies:

- [Nodejs 19.8.1](https://nodejs.org/en)
- [Docker](https://docs.docker.com/get-docker/)

## Project setup

1. Clone this repo

2. Install packages.
   In the root of the repository run:

```shell
npm ci
```

## Run tests

```shell
npm run tests
```

or use docker:

```shell
npm run docker:build
npm run docker:run
```

## Development

Since all network calls are being mocked, it is necessary to rely on fixtures stored in `/fixtures`.
Each test uses nock to mock a given path and returns a response, based on the predefined fixture.  
To create reliable fixtures, it's necessary to verify the real behavior of GitHub API.
To this end, one can use Postman to execute a request to a selected endpoint and then recreate this behavior in fixtures.

GitHub API requires the majority of calls to be executed with an auth token.
Go to [GitHub documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to learn how
to obtain a personal access token to your GitHub account.  
Once you have the token, you can attach an `Authorization` header in each request.
Read more about [GitHub API Authentication](https://docs.github.com/en/rest/overview/authenticating-to-the-rest-api?apiVersion=2022-11-28)
