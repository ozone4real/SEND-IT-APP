(async function() {
  const token = localStorage.getItem("token");
  if (!token) return (window.location.href = "/signup.html");
  const { response } = await getRequests("/api/v1/user", token);
  if (response.status !== 200) window.location.href = "/signup.html";
})();
