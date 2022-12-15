const VITE_CONFIG = {
  development: {
    baseApi: 'http://localhost:8890/runtime-api/edoms/run-time',
  },
  'page:admin': {
    baseApi: 'http://k8s.isiact.com/edoms-runtime-service-dev/edoms/run-time',
  },
};

window.VITE_CONFIG = VITE_CONFIG;
