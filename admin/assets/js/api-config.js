(function () {
  // Set window.ASK_BAGBIN_API_BASE before this file if the API lives on another host.
  // Example: window.ASK_BAGBIN_API_BASE = 'https://api.example.com/api';
  function normalize(value) {
    return String(value || '').replace(/\/$/, '');
  }

  const configured = normalize(window.ASK_BAGBIN_API_BASE);
  if (configured) {
    window.ASK_API_BASE = configured;
    return;
  }

  const port = window.location.port;
  const isLocalFile = window.location.protocol === 'file:';
  const isLocalDevServer = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname || '') && port && port !== '5000';

  // When an admin HTML file is opened directly or through Live Server,
  // send API requests to the Node backend on port 5000 instead of the
  // static-file server. This prevents the common 405 POST error.
  if (isLocalFile || isLocalDevServer) {
    window.ASK_API_BASE = 'http://localhost:5000/api';
  } else {
    window.ASK_API_BASE = '/api';
  }
})();
