<script>
const logout = () => {
  window.open('http://localhost:5000/auth/logout', '_self');
}
</script>

<template>
  <h1>Student</h1>
  <button @click="logout">Log out</button>
</template>
