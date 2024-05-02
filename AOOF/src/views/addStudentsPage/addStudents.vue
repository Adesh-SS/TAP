<script lang="ts">
// dependencies

import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

// styles

import styles from './addStudents.module.css';

// components

//assets

//Interfaces

interface Student {
    name: string;
    rollNumber: string;
    mailId: string;
}

//Functions and variables

const departments = ref<string[]>([]);
const visible = ref<boolean>(false);
const addMethod = ref<string>('csv');

const askDepartmentName = async () => {
    const result = await Swal.fire({
        title: 'Department name',
        input: 'text',
        icon: 'question',
        inputPlaceholder: 'Department....',
        showCancelButton: true,
        confirmButtonText: 'Create',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
        if (!value) {
            return 'You need to write something!'
        }
    }
    });

    if(result.isConfirmed){
        departments.value.push(result.value);
    }
    console.log(departments.value);
};

export default {
    setup(){
        const router = useRouter();
        const students = ref<Student[]>([]);
        const studentDetails = reactive({
            name: '',
            rollNumber: '',
            mailId: '',
        });

        const navigateBack = () => {
            router.go(-1);
        };

        const addStudents = () => {
            // Check if a student with the same roll number and mail id already exists
            const duplicate = students.value.some(existingStudent => {
                return existingStudent.rollNumber === studentDetails.rollNumber || existingStudent.mailId === studentDetails.mailId;
            });

            if (duplicate) {
                alert('Student with the same roll number or mail id already exists');
            } else {
                const student = {
                    name: studentDetails.name,
                    rollNumber: studentDetails.rollNumber,
                    mailId: studentDetails.mailId
                };
                students.value.push(student);
                studentDetails.name = '';
                studentDetails.rollNumber = '';
                studentDetails.mailId = '';
            }
        };

        const deleteStudent = (index: number) => {
            students.value.splice(index, 1);
        };

        return {
            styles,
            navigateBack,
            askDepartmentName,
            departments,
            visible,
            addMethod,
            students,
            studentDetails,
            addStudents,
            deleteStudent,
        };
    }
}
</script>

<template>
    <div :class="styles.addStudents_container">

        <!-- Header -->

        <div :class="styles.addStudents_header">
            <div :class="styles.addStudents_header_left">
                <button @click="navigateBack">
                    <i class="pi pi-arrow-circle-left" />
                </button>
            </div>
            <div :class="styles.addStudents_header_right">
                <button @click="askDepartmentName">
                    <i class="pi pi-plus-circle" />
                    Department
                </button>
            </div>
        </div>

        <!-- Body -->

        <div :class="styles.addStudents_content">

            <!--Sample Content-->

            <div :class="styles.addStudent_department_container">
                <div :class="styles.addStudent_department_end_rectangles">
                    <h1>00</h1>
                </div>
                <div :class="styles.addStudent_department_rectangles">
                    <h1>Department Name Goes Here</h1>
                </div>
                <div :class="styles.addStudent_department_rectangles">
                    <h1>Students:</h1>
                    <p>00</p>
                </div>
                <div :class="styles.addStudent_department_end_rectangles">
                    <i class="pi pi-plus-circle"  @click="visible = true"/>

                    <!-- Student Modal -->

                    <Dialog v-model:visible="visible" modal header="Add Students" :class="styles.addStudents_modal">
                        <div :class="styles.addStudents_modalContent">

                            <!-- Tabs -->

                            <div :class="styles.addStudents_modalContent_tabs_container">
                                <div 
                                    :class="addMethod === 'mail' ? styles.addStudents_modalContent_tabs_rectangles_focus : styles.addStudents_modalContent_tabs_rectangles"
                                    @click="addMethod = 'mail'"
                                >
                                    <h1>By Mail</h1>
                                </div>
                                
                                <div :class="addMethod === 'csv' ? styles.addStudents_modalContent_tabs_rectangles_focus : styles.addStudents_modalContent_tabs_rectangles"
                                    @click="addMethod = 'csv'"
                                >
                                    <h1>By CSV</h1>
                                </div>
                            </div>

                            <!-- By Mail -->

                            <div v-if="addMethod === 'mail'" :class="styles.addStudents_modalContent_byMail_container">

                                <!-- Inputs container -->

                                <div :class="styles.addStudents_modalContent_byMail_input_container">
                                    <div :class="styles.input_container">
                                        <input type="text" v-model="studentDetails.name" @keydown.enter.prevent="addStudents" required>
                                        <label for="input" :class="styles.label">Student Name</label>
                                        <div :class="styles.underline"></div>
                                    </div>
                                    <div :class="styles.input_container">
                                        <input type="text" v-model="studentDetails.rollNumber" @keydown.enter.prevent="addStudents" required>
                                        <label for="input" :class="styles.label">Student Roll Number</label>
                                        <div :class="styles.underline"></div>
                                    </div>
                                    <div :class="styles.input_container">
                                        <input type="text" v-model="studentDetails.mailId" @keydown.enter.prevent="addStudents" required>
                                        <label for="input" :class="styles.label">Student Mail ID</label>
                                        <div :class="styles.underline"></div>
                                    </div>
                                </div>

                                <!-- Details display container -->

                                <div :class="styles.addStudents_modalContent_byMail_display_container">
                                    <div v-for="(student, index) in students" 
                                        :key="index" 
                                        :class="styles.addStudents_modalContent_byMail_display"
                                        @click="deleteStudent(index)"
                                    >
                                        <h1>{{ `${student.name}(${student.rollNumber})(${student.mailId})` }}</h1>
                                    </div>
                                </div>
                            </div>

                            <!-- By CSV -->

                            <div v-else :class="styles.addStudents_modalContent_byCSV_container"></div>

                            <!-- Buttons -->

                            <div :class="styles.addStudents_modalContent_buttons_container">
                                <button>
                                    <i class="pi pi-save" />
                                    Save
                                </button>
                            </div>
                        </div>
                    </Dialog>

                    <i class="pi pi-trash" />
                </div>
            </div>

            <!-- Actual Map -->

            <div v-for="(department, index) in departments" :key="index" :class="styles.addStudent_department_container">
                <div :class="styles.addStudent_department_end_rectangles">
                    <h1>{{ index + 1 }}</h1>
                </div>
                <div :class="styles.addStudent_department_rectangles">
                    <h1>{{ department }}</h1>
                </div>
                <div :class="styles.addStudent_department_rectangles">
                    <h1>Students:</h1>
                    <p>0</p>
                </div>
                <div :class="styles.addStudent_department_end_rectangles">
                    <i class="icon-class" @click="visible = true"></i>
                    <i class="pi pi-trash" />
                </div>
            </div>
        </div>
        <!-- <Button label="Show" @click="visible = true" /> -->

        <!-- Footer -->

        <div :class="styles.addStudents_footer">
            <button>
                <i class="pi pi-save" />
                Save
            </button>
        </div>
    </div>
</template>