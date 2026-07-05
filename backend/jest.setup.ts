process.env.NODE_ENV = 'test'
jest.mock('./src/lib/redis', () => ({
  connection: {}
}))

jest.mock('./src/lib/queue', () => ({
  emailQueue: {
    add: jest.fn().mockResolvedValue({})
  }
}))