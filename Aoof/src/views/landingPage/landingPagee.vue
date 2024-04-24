<script setup lang="ts">
//Components

import styles from './landing.module.css'
import bitLogo from '../../components/icons/BIT.webp'

//Functions

const googleLogin = () => {
  window.open('http://localhost:5000/auth/google', 'Google Login', 'width=500,height=600');
}
</script>

<template>
  <!-- The whole box for login -->
  <div :class="styles.login_container">
    <div :class="styles.login_logo_container">
      <img :src="bitLogo" alt="BIT Logo" />
    </div>

    <!-- Mentor and Special Lab In-charge login using MentorID or FacultyID -->
    <div :class="styles.login_text_container">
      <h1>Mentor / Special Lab In-charge Login</h1>
    </div>

    <div :class="styles.login_faculty_container">
      <input type="text" placeholder="Mentor ID / Faculty ID" />
      <input type="password" placeholder="Password" />

      <div :class="styles.login_button_container">
        <button :class="styles.login_button">Sign in</button>
      </div>
    </div>

    <!-- Student Login using mailID -->

    <div :class="styles.login_text_container">
      <h1>Student Login</h1>
    </div>

    <div :class="styles.login_button_container">
      <button :class="styles.login_button" @click="googleLogin">Sign in with Google</button>
    </div>
  </div>
</template>
