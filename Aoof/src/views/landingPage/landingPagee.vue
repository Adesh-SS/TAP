<script setup lang="ts">
import styles from './landing.module.css';
import bitLogo from '../../components/icons/BIT.webp';

import { useRouter, RouterView } from 'vue-router';

const router = useRouter();

const login = () => {
    router.push('/student');
}
</script>

<template>
    <div :class="styles.login_container">
        <div :class="styles.login_logo_container">
            <img :src="bitLogo" alt="BIT Logo" />
        </div>
        <div :class="styles.login_text_container">
            <h1>Sign in with Google Account</h1>
        </div>
        <div :class="styles.login_button_container">
            <button :class="styles.login_button" @click="login">Sign in with Google</button>
        </div>
    </div>
</template>