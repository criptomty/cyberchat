(function (global) {
  const defaultKnowledge = {
    products: {
      'iphone 17': {
        price: '$999',
        stock: 'Available',
        description: 'Latest Apple smartphone',
      },
      'galaxy s26': {
        price: '$899',
        stock: 'Available',
        description: 'Samsung smartphone',
      },
    },
    intents: {
      price: ['price', 'cost', 'how much'],
      stock: ['stock', 'available'],
      about: ['about', 'tell me about', 'details', 'info'],
    },
    greetings: ['hello', 'hi', 'hey', 'hola'],
  };

  function normalizeText(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function detectGreeting(message, greetings = []) {
    const normalized = normalizeText(message);
    return greetings.find((word) => normalized.includes(word)) || '';
  }

  function detectProduct(message, products = {}) {
    const normalized = normalizeText(message);
    const productNames = Object.keys(products);

    return productNames.find((name) => normalized.includes(normalizeText(name))) || '';
  }

  function detectIntent(message, intents = {}) {
    const normalized = normalizeText(message);
    const foundIntent = Object.entries(intents).find(([, keywords]) => {
      return keywords.some((keyword) => normalized.includes(normalizeText(keyword)));
    });

    return foundIntent ? foundIntent[0] : '';
  }

  function generateResponse(message, knowledge = defaultKnowledge) {
    const greetings = knowledge.greetings || defaultKnowledge.greetings;
    const products = knowledge.products || defaultKnowledge.products;
    const intents = knowledge.intents || defaultKnowledge.intents;

    const greeting = detectGreeting(message, greetings);
    const product = detectProduct(message, products);
    const intent = detectIntent(message, intents);

    if (greeting && product && intent) {
      const productInfo = products[product];
      if (intent === 'price') {
        return `${capitalize(greeting)}! The ${formatProductName(product)} price is ${productInfo.price}.`;
      }
      if (intent === 'stock') {
        return `${capitalize(greeting)}! The ${formatProductName(product)} is ${productInfo.stock.toLowerCase()}.`;
      }
      if (intent === 'about') {
        return `${capitalize(greeting)}! ${formatProductName(product)}: ${productInfo.description}.`;
      }
    }

    if (greeting && product) {
      const productInfo = products[product];
      return `${capitalize(greeting)}! The ${formatProductName(product)} price is ${productInfo.price}.`;
    }

    if (product) {
      const productInfo = products[product];
      if (intent === 'stock') {
        return `The ${formatProductName(product)} is ${productInfo.stock.toLowerCase()}.`;
      }
      if (intent === 'about') {
        return `${formatProductName(product)}: ${productInfo.description}.`;
      }
      return `The ${formatProductName(product)} price is ${productInfo.price}.`;
    }

    if (greeting) {
      return `${capitalize(greeting)}! How can I help you today?`;
    }

    return 'I am still learning. Could you ask me about our products, prices or availability?';
  }

  function capitalize(value) {
    return String(value).charAt(0).toUpperCase() + String(value).slice(1);
  }

  function formatProductName(product) {
    return product
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  class Chatbot {
    constructor(knowledge = defaultKnowledge) {
      this.knowledge = knowledge;
    }

    detectGreeting(message) {
      return detectGreeting(message, this.knowledge.greetings || defaultKnowledge.greetings);
    }

    detectProduct(message) {
      return detectProduct(message, this.knowledge.products || defaultKnowledge.products);
    }

    detectIntent(message) {
      return detectIntent(message, this.knowledge.intents || defaultKnowledge.intents);
    }

    generateResponse(message) {
      return generateResponse(message, this.knowledge);
    }
  }

  global.Chatbot = Chatbot;
  global.detectGreeting = detectGreeting;
  global.detectProduct = detectProduct;
  global.detectIntent = detectIntent;
  global.generateResponse = generateResponse;
})(window);
