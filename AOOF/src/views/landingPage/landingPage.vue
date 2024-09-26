<script setup lang="ts">
// Dependencies

import { ref } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import { useRouter } from 'vue-router';

// Components

// Styles

import styles from './landingPage.module.css';

// Assets

import clgLogo from '@/assets/icons/clgLogo.png'
import 'primeicons/primeicons.css'

//Interfaces

interface loginStuff {
    loginId: string;
    password: string;
}

//variables

const formDetails = ref<loginStuff>({
    loginId: '',
    password: '',
})
const toast = useToast();
const router = useRouter();

//functions

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      loginId: formDetails.value.loginId,
      password: formDetails.value.password,
    });

    if(response.data && response.data.token){
      localStorage.setItem('inutile', response.data.token);
      localStorage.setItem('auth', response.data.false);
    }

    if (response.status === 200) {
      toast.add({severity:'success', summary: 'Success', detail: 'Login successful', life: 2000});

      if(response.data.role === 'Admin'){
        router.push({name: 'Admin Dashboard'});
      }
    } else {
      toast.add({severity:'error', summary: 'Error', detail: 'Login failed', life: 2000});
    }
  } catch (error) {
    if (error instanceof Error) {
      toast.add({severity:'error', summary: 'Error', detail: error.message, life: 2000});
    } else {
      toast.add({severity:'error', summary: 'Error', detail: 'An error occurred', life: 2000});
    }
  }
};

</script>

<template>
    <Toast />
    <div :class="styles.landingPage__container">
        <div :class="styles.landingPage_login_container">
            <div :class="styles.landingPage_login_image_container">
                <img :src="clgLogo" alt="clgLogo" />
            </div>
            <div :class="styles.landingPage_facultyLogin_container">
                <h1>Login</h1>
                <form @submit.prevent="handleLogin">
                    <input 
                        type="text" 
                        placeholder="Roll Number / Mentor ID / Admin ID"
                        v-model="formDetails.loginId"
                        required
                     />
                    <input 
                        type="password" 
                        placeholder="Password"
                        v-model="formDetails.password"
                        required
                    />
                    <button type="submit">Sign In</button>
                </form>
            </div>
            <div :class="styles.landingPage_studentLogin_container">
                <h1>Google Login</h1>
                <button>
                    <i class="pi pi-google"></i>
                    Sign In With Google
                </button>
            </div>
        </div>
    </div>
</template>