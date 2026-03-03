document.addEventListener("DOMContentLoaded", () => {
  const isAuthorized = Boolean(document.cookie.split(";")[0].split("=")[1])
  if(!isAuthorized) window.location.href = "/login/login.html"
})