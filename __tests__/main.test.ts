/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as nats from 'nats'
import * as main from '../src/main'

// Mock the GitHub Actions core library
const debugMock = jest.spyOn(core, 'debug')
const getInputMock = jest.spyOn(core, 'getInput')
const setFailedMock = jest.spyOn(core, 'setFailed')
const setOutputMock = jest.spyOn(core, 'setOutput')

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

const connectMock = jest.spyOn(nats, 'connect')

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const testValues = {
    subject: 'subject.test',
    urls: 'nats://localhost:4222',
    message: '{"test": 1234}',
    nKeySeed: 'SNOTAREALNKEYSEED',
    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  }

  it('Connects to NATS', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'subject':
          return testValues.subject
        case 'urls':
          return testValues.urls
        case 'message':
          return testValues.message
        case 'nKeySeed':
          return testValues.nKeySeed
        case 'jwt':
          return testValues.jwt
        default:
          return ''
      }
    })

    // Mock the NATS connection
    const mockConnectImpl = async (): Promise<nats.NatsConnection> => {
      const info = {
        server_name: 'nats://localhost:4222'
      } as nats.ServerInfo
      return {
        info,
        publish: jest.fn(),
        close: jest.fn(),
        closed: jest.fn(),
        drain: jest.fn()
      } as unknown as nats.NatsConnection
    }
    connectMock.mockImplementation(mockConnectImpl)

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(debugMock).toHaveBeenNthCalledWith(
      1,
      'connecting to:\nnats://localhost:4222'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      2,
      `NATS connected to nats://localhost:4222`
    )
    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'published',
      `subject: subject.test, message: {"test": 1234}`
    )
  })

  it('Fails when a connection error occurs', async () => {
    // Mock the NATS connection
    const mockConnectImpl = async (): Promise<nats.NatsConnection> => {
      throw new Error('Invalid URL')
    }

    connectMock.mockImplementation(mockConnectImpl)

    await main.run()
    expect(runMock).toHaveReturned()

    expect(setFailedMock).toHaveBeenNthCalledWith(1, 'Invalid URL')
  })

  it('Fails when a connection close error occurs', async () => {
    // Mock the NATS connection
    const mockConnectImpl = async (): Promise<nats.NatsConnection> => {
      return {
        info: { server_name: 'nats://localhost:4222' },
        publish: jest.fn(),
        close: jest.fn(),
        // Yes, closed() returns an Error rather than throwing one
        closed: async () => new Error('connection already closed'),
        drain: jest.fn()
      } as unknown as nats.NatsConnection
    }

    connectMock.mockImplementation(mockConnectImpl)

    await main.run()
    expect(runMock).toHaveReturned()

    expect(debugMock).toHaveBeenNthCalledWith(
      5,
      'error closing:\nconnection already closed'
    )
  })
})
