<script lang="ts">
//dependencies

//style

import styles from './genReport.module.css';

//components    

//assets

//Functions and variables

export default{
    setup(){
        return{
            styles,
        };
    }
}
</script>

<template>
    <div :class="styles.genReport_container">
        <div :class="styles.genReport_academicYear_container">
            <div :class="styles.genReport_academicYear_rectangles">
                <h1>First Year</h1>
            </div>
            <div :class="styles.genReport_academicYear_rectangles">
                <h1>Students:</h1>
                <p>00</p>
            </div>
            <div :class="styles.genReport_academicYear_rectangles">
                <button>Generate Report</button>
            </div>
        </div>
        <div :class="styles.genReport_academicYear_container">
            <div :class="styles.genReport_academicYear_rectangles">
                <h1>Second Year</h1>
            </div>
            <div :class="styles.genReport_academicYear_rectangles">
                <h1>Students:</h1>
                <p>00</p>
            </div>
            <div :class="styles.genReport_academicYear_rectangles">
                <button>Generate Report</button>
            </div>
        </div>
        <div :class="styles.genReport_academicYear_container">
            <div :class="styles.genReport_academicYear_rectangles">
                <h1>Third Year</h1>
            </div>
            <div :class="styles.genReport_academicYear_rectangles">
                <h1>Students:</h1>
                <p>00</p>
            </div>
            <div :class="styles.genReport_academicYear_rectangles">
                <button>Generate Report</button>
            </div>
        </div>
        <div :class="styles.genReport_academicYear_container">
            <div :class="styles.genReport_academicYear_rectangles">
                <h1>Final Year</h1>
            </div>
            <div :class="styles.genReport_academicYear_rectangles">
                <h1>Students:</h1>
                <p>00</p>
            </div>
            <div :class="styles.genReport_academicYear_rectangles">
                <button>Generate Report</button>
            </div>
        </div>
    </div>
</template>