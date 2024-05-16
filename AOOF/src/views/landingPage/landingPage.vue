<script setup lang="ts">
// Dependencies

// Components

// Styles

import styles from './landingPage.module.css';

// Assets

import clgLogo from '@/assets/icons/clgLogo.png'
import 'primeicons/primeicons.css'

</script>

<template>
    <div :class="styles.landingPage__container">
        <div :class="styles.landingPage_login_container">
            <div :class="styles.landingPage_login_image_container">
                <img :src="clgLogo" alt="clgLogo" />
            </div>
            <div :class="styles.landingPage_facultyLogin_container">
                <h1>Faculty Login</h1>
                <form>
                    <input type="text" placeholder="Mentor ID / Special Lab ID / Admin ID" />
                    <input type="password" placeholder="Password" />
                    <button>Sign In</button>
                </form>
            </div>
            <div :class="styles.landingPage_studentLogin_container">
                <h1>Student Login</h1>
                <button>
                    <i class="pi pi-google"></i>
                    Sign In With Google
                </button>
            </div>
        </div>
    </div>
</template>