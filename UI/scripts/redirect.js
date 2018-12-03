(async function () {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = '/signup.html';
  const response = await fetch('/api/v1/user', {
    headers: {
      'x-auth-token': token,
    }
  });

  if (response.status !== 200) 
  window.location.href = '/signup.html';
}());