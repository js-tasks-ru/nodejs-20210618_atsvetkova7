function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Incorrect type of arguments');
  }

  return a + b;
}

module.exports = sum;
