<script lang="ts">
// dependencies

import { ref } from 'vue';
import { useRouter } from 'vue-router';

// styles

import styles from './addUsers.module.css';

// components

//assets

//Functions and variables

const selectedTab = ref<string>('students');

export default {
    setup(){
        const router = useRouter();

        const navigateTo = (path: string) => {
            router.push(`admin/${path}`);
        };
        
        return {
            styles,
            selectedTab,
            navigateTo
        };
    }
}
</script>

<template>
    <div :class="styles.addUsers_container">

        <!-- Tabs: students, mentors, in-charges -->

        <div :class="styles.addUser_tab_container">
            <div 
                :class="selectedTab === 'students' ? styles.addUser_tab_rectangle_focus : styles.addUser_tab_rectangle"
                @click="selectedTab = 'students'"
            >
                <h1>Students</h1>
            </div>
            <div 
                :class="selectedTab === 'mentors' ? styles.addUser_tab_rectangle_focus : styles.addUser_tab_rectangle"
                @click="selectedTab = 'mentors'"
            >
                <h1>Mentors</h1>
            </div>
            <div 
                :class="selectedTab === 'specials' ? styles.addUser_tab_rectangle_focus : styles.addUser_tab_rectangle"
                @click="selectedTab = 'specials'"
            >
                <h1>In-charge</h1>
            </div>
        </div>

        <!-- Tab respective containers -->

        <div :class="styles.addUser_details_container">
            
            <!-- Students -->

            <div v-if="selectedTab === 'students'">
                <div :class="styles.addUser_students_year_container">
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>First Year</h1>
                    </div>
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Departments:</h1>
                        <p>00</p>
                    </div>
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Students:</h1>
                        <p>00</p>
                    </div>
                    <i class="pi pi-eye" @click="navigateTo('firstYear')"></i>
                </div>
                <div :class="styles.addUser_students_year_container">
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Second Year</h1>
                    </div>
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Departments:</h1>
                        <p>00</p>
                    </div>
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Students:</h1>
                        <p>00</p>
                    </div>
                    <i class="pi pi-eye" @click="navigateTo('secondYear')"></i>
                </div>
                <div :class="styles.addUser_students_year_container">
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Third Year</h1>
                    </div>
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Departments:</h1>
                        <p>00</p>
                    </div>
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Students:</h1>
                        <p>00</p>
                    </div>
                    <i class="pi pi-eye" @click="navigateTo('thirdYear')"></i>
                </div>
                <div :class="styles.addUser_students_year_container">
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Final Year</h1>
                    </div>
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Departments:</h1>
                        <p>00</p>
                    </div>
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Students:</h1>
                        <p>00</p>
                    </div>
                    <i class="pi pi-eye" @click="navigateTo('finalYear')"></i>
                </div>
            </div>

            <!-- Mentors -->

            <div v-if="selectedTab === 'mentors'">
                <div :class="styles.addUser_mentor_add_container">
                    <button>
                        <i class="pi pi-plus-circle"></i>
                        Mentors
                    </button>
                </div>
                <div :class="styles.addUser_mentor_details_container"></div>
            </div>

            <!-- In-charges -->

            <div v-if="selectedTab === 'specials'">
                <div :class="styles.addUser_incharge_add_container">
                    <button>
                        <i class="pi pi-plus-circle"></i>
                        In-charge
                    </button>
                </div>
                <div :class="styles.addUser_incharge_details_container"></div>
            </div>
        </div>
    </div>
</template>