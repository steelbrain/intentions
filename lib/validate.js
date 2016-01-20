'use babel'

export function provider(provider) {
  if (!provider || typeof provider !== 'object') {
    throw new Error('Invalid provider provided')
  } else if (!Array.isArray(provider.grammarScopes)) {
    throw new Error('Invalid or no grammarScopes found on provider')
  } else if (typeof provider.getIntentions !== 'function') {
    throw new Error('Invalid or no getIntentions found on provider')
  }
}
