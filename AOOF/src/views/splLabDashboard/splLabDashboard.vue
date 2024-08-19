<script lang="ts">
// Dependencies

import { ref, onMounted } from "vue";

// Components

// Styles

import styles from './splLabDashboard.module.css';

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
    <div :class="styles.splLabDashboard_container">

        <!-- Side Bar -->

        <div :class="styles.splLabDashboard_sidebar">

            <!-- Home, Add, Report tabs -->

            <div :class="styles.splLabDashboard_sidebar_first_half">
                <div 
                    :class="sideBarSelected === 'home' ? styles.splLabDashboard_sidebar_icon_focus_container : styles.splLabDashboard_sidebar_icon_container"
                    @click="sideBarSelected = 'home'"
                >
                    <i class="pi pi-home"></i>
                </div>
            </div>

            <!-- Profile, Logout -->

            <div :class="styles.splLabDashboard_sidebar_second_half">
                <div 
                    :class="sideBarSelected === 'Profile' ? styles.splLabDashboard_sidebar_icon_focus_container : styles.splLabDashboard_sidebar_icon_container"
                    @click="sideBarSelected = 'Profile'"
                >
                    <i class="pi pi-user"></i>
                </div>
                <div 
                    :class="sideBarSelected === 'Logout' ? styles.splLabDashboard_sidebar_icon_focus_container : styles.splLabDashboard_sidebar_icon_container"
                    @click="sideBarSelected = 'Logout'"
                >
                    <i class="pi pi-sign-out"></i>
                </div>
            </div>
        </div>

        <!-- Main Content -->

        <div :class="styles.splLabDashboard_rest_container">

            <!-- Header -->

            <div :class="styles.splLabDashboard_header">
                <h1>On-duty Approval</h1>
                <div :class="styles.splLabDashboard_header_search_container">
                    <AutoComplete v-model="value" 
                    :suggestions="items"
                    @complete="search" 
                    placeholder="Search by Roll Number/Mentor ID/Special Lab ID ...." />
                </div>
            </div>

            <!-- Content -->

            <div :class="styles.splLabDashboard_content_container">
                <add-od />
            </div>
        </div>
    </div>


</template>