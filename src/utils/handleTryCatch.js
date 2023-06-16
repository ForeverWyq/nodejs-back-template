async function handleTryCatch(fn, ...args) {
  try {
    return [null, await fn(...args)];
  } catch (e) {
    return [e];
  }
}

module.exports = handleTryCatch;
