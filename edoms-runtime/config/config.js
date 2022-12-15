const VITE_CONFIG = {
  dev: {
    baseApi: 'http://localhost:8890/runtime-api/edoms/run-time',
  },
  admin: {
    baseApi: 'http://k8s.isiact.com/edoms-runtime-service-dev/edoms/run-time',
  },
};

window.VITE_CONFIG = VITE_CONFIG;
