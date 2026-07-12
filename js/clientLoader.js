(function (global) {
  const DEFAULT_CLIENT = 'phone-store';

  function getClientFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('client');
  }

  function loadClientConfig() {
    return fetch('./data/config.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Config not available');
        }
        return response.json();
      })
      .then((config) => config && config.activeClient ? config.activeClient : DEFAULT_CLIENT)
      .catch(() => DEFAULT_CLIENT);
  }

  function loadClient() {
    const clientFromUrl = getClientFromUrl();

    if (clientFromUrl) {
      console.log('Loading client...');
      console.log('Client selected from URL:', clientFromUrl);
      return fetch(`./data/clients/${clientFromUrl}/knowledge.json`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Client knowledge not found');
          }
          return response.json();
        })
        .then((knowledge) => {
          console.log('Knowledge loaded successfully.');
          return knowledge;
        })
        .catch(() => {
          console.warn('Falling back to phone-store');
          return loadClientFromDefault();
        });
    }

    return loadClientConfig().then((client) => {
      console.log('Loading client...');
      console.log('Client selected from config:', client);
      return loadClientKnowledge(client);
    });
  }

  function loadClientKnowledge(clientName) {
    return fetch(`./data/clients/${clientName}/knowledge.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Client knowledge not found');
        }
        return response.json();
      })
      .then((knowledge) => {
        console.log('Knowledge loaded successfully.');
        return knowledge;
      })
      .catch(() => loadClientFromDefault());
  }

  function loadClientFromDefault() {
    return loadClientKnowledge(DEFAULT_CLIENT);
  }

  global.loadClient = loadClient;
})(window);
