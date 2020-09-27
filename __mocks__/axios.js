module.exports = {
  /** Use jest mock function to implement axios get call for testing
   * Get call returns a promise, so we instantly resolve a promise with
   * an empty data object, which can be altered at time of use in tests
   */
  get: jest.fn(() => Promise.resolve({ data: {} })),
};
