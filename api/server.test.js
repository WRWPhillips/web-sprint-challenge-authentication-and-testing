const db = require('../data/dbConfig');
const request = require('supertest');
const server = require('./server');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})

beforeEach(async () => {
  await db('users').truncate();
})

describe('model test', () => {

  it('loads empty table', async () => {
    const users = await db('users');
    expect(users).toHaveLength(0);
  })
})

describe('server endpoints', () => {

  it('[POST] "/register" is successful', async () => {
    let res = await request(server)
      .post('/api/auth/register')
      .send({ username: "Josh", password: "1234"});
    expect(res.status).toBe(201)
  })

  it('[POST] "/register" shows creds on login ', async () => {
    let res = await request(server)
      .post('/api/auth/register')
      .send({ username: "Josh", password: "1234"});
    expect(res.body).toHaveProperty('username', "Josh");
  })

  it('[POST] "/login" error message on bad login', async () => {
    let res =await request(server)
      .post('/api/auth/login')
      .send({username: 'Josh', password: '1234' });
    expect(res.body).toMatchObject({ message: 'Invalid credentials.'});
  })

  it('[POST] "/login" error message with null username/password', async () => {
    let res =await request(server)
      .post('/api/auth/login')
      .send({username: 'Josh'});
    expect(res.body).toMatchObject({ message: 'Username and password are required!'});
  })

  it('[GET] "/" doesn\'t reveal jokes', async () => {
    let res = await request(server).get('/api/jokes');
    expect(res.body).toMatchObject({message: "token required"})
  })

  it('[GET] "/" right status code for failed login', async () => {
    let res = await request(server).get('/api/jokes');
    expect(res.status).toBe(401);
  })
});