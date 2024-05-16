<script lang="ts">
//dependencies

// import { ref } from 'vue';
import { useRouter } from 'vue-router';

//style

import styles from './genReport.module.css';

//components    

//assets

//variables

//functions

export default{
    setup(){
        const router = useRouter();

        const navigateTo = (path: string) => {
            router.push(`/admin/report/${path}`)
        }

        return{
            styles,
            navigateTo,
        };
    }
}
</script>

<template>
    <div :class="styles.genReport_container">

        <!-- First Years -->

        <div :class="styles.genReport_academicYear_container">
            <div :class="styles.genReport_academicYear_rectangles">
                <h1>First Year</h1>
            </div>
            <div :class="styles.genReport_academicYear_rectangles">
                <h1>Students:</h1>
                <p>00</p>
            </div>
            <div :class="styles.genReport_academicYear_rectangles">
                <button
                 @click="navigateTo('firstYear')"
                >
                 Generate Report
                </button>
            </div>
        </div>

        <!-- Second Years -->

        <div :class="styles.genReport_academicYear_container">
            <div :class="styles.genReport_academicYear_rectangles">
                <h1>Second Year</h1>
            </div>
            <div :class="styles.genReport_academicYear_rectangles">
                <h1>Students:</h1>
                <p>00</p>
            </div>
            <div :class="styles.genReport_academicYear_rectangles">
                <button
                    @click="navigateTo('secondYear')"
                >
                    Generate Report
                </button>
            </div>
        </div>

        <!-- Third Years -->

        <div :class="styles.genReport_academicYear_container">
            <div :class="styles.genReport_academicYear_rectangles">
                <h1>Third Year</h1>
            </div>
            <div :class="styles.genReport_academicYear_rectangles">
                <h1>Students:</h1>
                <p>00</p>
            </div>
            <div :class="styles.genReport_academicYear_rectangles">
                <button
                    @click="navigateTo('thirdYear')"
                >
                    Generate Report
                </button>
            </div>
        </div>

        <!-- Final Years -->

        <div :class="styles.genReport_academicYear_container">
            <div :class="styles.genReport_academicYear_rectangles">
                <h1>Final Year</h1>
            </div>
            <div :class="styles.genReport_academicYear_rectangles">
                <h1>Students:</h1>
                <p>00</p>
            </div>
            <div :class="styles.genReport_academicYear_rectangles">
                <button
                    @click="navigateTo('finalYear')"
                >
                    Generate Report
                </button>
            </div>
        </div>
    </div>
</template>