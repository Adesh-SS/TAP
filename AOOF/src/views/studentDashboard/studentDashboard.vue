<script lang="ts">
// Dependencies

import { ref, onMounted } from "vue";

// Components

// Styles

import styles from './studentDashboard.module.css';

// Assets

// Interfaces

//Functions and variables

const sideBarSelected = ref<string>('home');

export default {
  setup() {

    return {
        styles,
        sideBarSelected,
    };
  }
};
</script>

<template>
    <div :class="styles.studentDashboard_container">

        <!-- Side Bar -->

        <div :class="styles.studentDashboard_sidebar">

            <!-- Home, Add, Report tabs -->

            <div :class="styles.studentDashboard_sidebar_first_half">
                <div 
                    :class="sideBarSelected === 'home' ? styles.studentDashboard_sidebar_icon_focus_container : styles.studentDashboard_sidebar_icon_container"
                    @click="sideBarSelected = 'home'"
                >
                    <i class="pi pi-home"></i>
                </div>
            </div>

            <!-- Profile, Logout -->

            <div :class="styles.studentDashboard_sidebar_second_half">
                <div 
                    :class="sideBarSelected === 'Profile' ? styles.studentDashboard_sidebar_icon_focus_container : styles.studentDashboard_sidebar_icon_container"
                    @click="sideBarSelected = 'Profile'"
                >
                    <i class="pi pi-user"></i>
                </div>
                <div 
                    :class="sideBarSelected === 'Logout' ? styles.studentDashboard_sidebar_icon_focus_container : styles.studentDashboard_sidebar_icon_container"
                    @click="sideBarSelected = 'Logout'"
                >
                    <i class="pi pi-sign-out"></i>
                </div>
            </div>
        </div>

        <!-- Main Content -->

        <div :class="styles.studentDashboard_rest_container">

            <!-- Header -->

            <div :class="styles.studentDashboard_header">
                <h1>Apply On-duty</h1>
                <div :class="styles.studentDashboard_apply_container">
                    <button>
                        <i class="pi pi-plus-circle"></i>
                        On-Duty
                    </button>
                </div>
            </div>

            <!-- Content -->

            <div :class="styles.studentDashboard_content_container">
                <add-od />
            </div>
        </div>
    </div>


</template>