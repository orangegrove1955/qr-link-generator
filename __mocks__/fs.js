module.exports = {
  /** Use jest mock function to implement qrcode generator for testing
   * Resolves an empty promise, which can be altered at time of use in tests
   */
  writeFile: jest.fn(() => Promise.resolve("mocked")),
};
