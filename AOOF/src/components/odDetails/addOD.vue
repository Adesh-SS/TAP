<script lang="ts">
// dependencies

import { ref } from 'vue';
import { useRouter } from 'vue-router';

// styles

import styles from './addOD.module.css';

// components

//assets

//interfaces

//variables

const selectedTab = ref<string>('proposed');

//functions

//exports

export default {
    setup(){
        
        return {
            styles,
            selectedTab,
        };
    }
}
</script>

<template>
    <div :class="styles.addUsers_container">

        <!-- Tabs: students, mentors, in-charges -->

        <div :class="styles.addUser_tab_container">
            <div 
                :class="selectedTab === 'proposed' ? styles.addUser_tab_rectangle_focus : styles.addUser_tab_rectangle"
                @click="selectedTab = 'proposed'"
            >
                <h1>Proposed</h1>
            </div>
            <div 
                :class="selectedTab === 'rejected' ? styles.addUser_tab_rectangle_focus : styles.addUser_tab_rectangle"
                @click="selectedTab = 'rejected'"
            >
                <h1>Rejected</h1>
            </div>
            <div 
                :class="selectedTab === 'completed' ? styles.addUser_tab_rectangle_focus : styles.addUser_tab_rectangle"
                @click="selectedTab = 'completed'"
            >
                <h1>Completed</h1>
            </div>
        </div>

        <!-- Tab respective containers -->

        <div :class="styles.addUser_details_container">
            
            <!-- Proposed -->

            <div v-if="selectedTab === 'proposed'">
            </div>

            <!-- Rejected -->

            <div v-if="selectedTab === 'rejected'">
            </div>

            <!-- Completed -->

            <div v-if="selectedTab === 'completed'">
            </div>
        </div>
    </div>
</template>