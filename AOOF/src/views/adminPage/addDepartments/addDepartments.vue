<script lang="ts">

//dependencies

import { onMounted, reactive, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Papa from 'papaparse';
import { ParseResult } from 'papaparse';

//styles

import styles from './addDepartments.module.css';

//interfaces

interface Department {
    name: string;
    studentsCount: number;
}

interface Student {
    studentId: string;
    studentName: string;
    studentEmail: string;
    mentorId: string;
}

interface ParseResult<T> {
  data: T[];
  errors: any[];
  meta: {
    delimiter: string;
    linebreak: string;
    aborted: boolean;
    truncated: boolean;
    cursor: number;
  };
}

//exports

export default {
  components: {
    Toast
  },
  setup() {

    //variables

    const router = useRouter();
    const route = useRoute();
    const addDepartmentsModal = ref<boolean>(false);
    const departments = ref<Department[]>([]);
    const toast = useToast();
    const addStudentsModal = ref<boolean>(false);
    const tabClicked = ref<string>('byMail');
    const students = ref<Student[]>([]);
    const student = reactive<Student>({
        studentId: '',
        studentName: '',
        studentEmail: '',
        mentorId: ''
    });
    const emailRegex = /^[a-z]+\.([a-z]{2})[0-9]{2}@bitsathy\.ac\.in$/;
    const rollNoRegex = /^[0-9]{5}[0-9]{2}[A-Z]{2}[0-9]{3}$/;
    const presentDepartmentName = ref<string>('');
    const studentFileName = ref<string>('Browse for file');

    //functions

    const goBack = () => {
      router.go(-1);
    }

    const handleAddDepartment = async (event: Event) => {
      const batchName = route.params.batchName;
      event.preventDefault();

      const name = (event.target as HTMLFormElement).batchName.value;

      try {
        const response = await axios.post('http://localhost:5000/department/addDepartment', {
            name,
            batchName
        });
        
        if(response.status === 200) {
          (event.target as HTMLFormElement).reset();
          const newDepartment = {
            name,
            studentsCount: 0
          }
          departments.value.push(newDepartment);
          toast.add({ severity: 'success', summary: 'Success', detail: 'Department added successfully', life: 2000 });
          addDepartmentsModal.value = false;
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            toast.add({ severity: 'error', summary: 'Error', detail: error.response.data, life: 2000 });
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred', life: 2000 });
        }
      }
    }

    const handleGetAllDepartments = async () => {
      const batchName = route.params.batchName;
      try {
        const response = await axios.get(`http://localhost:5000/department/getDepartments/${batchName}`);
        if(response.status === 200) {
          departments.value = response.data;
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            toast.add({ severity: 'error', summary: 'Error', detail: error.response.data, life: 2000 });
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred', life: 2000 });
        }
      }
    }

    const handleDeleteDepartment = async (departmentName: string) => {
        const batchName = route.params.batchName;
        try {
            const response = await axios.delete(`http://localhost:5000/department/deleteDepartment/${batchName}/${departmentName}`);
            if(response.status === 200) {
                departments.value = departments.value.filter(department => department.name !== departmentName);
                toast.add({ severity: 'success', summary: 'Success', detail: 'Department deleted successfully', life: 2000 });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.add({ severity: 'error', summary: 'Error', detail: error.response.data, life: 2000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred', life: 2000 });
            }
        }
    }

    const selectDepartment = (name: string) => {
        addStudentsModal.value = true;
        presentDepartmentName.value = name;
        fetchStudents();
    }

    const deselectDepartment = () => {
        presentDepartmentName.value = '';
        addStudentsModal.value = false;
    };

    watch(addStudentsModal, (newValue) => {
      if (!newValue) {
        window.location.reload();
      }
    });

    const handleAddStudentsByMail = async(event: Event) => {
        event.preventDefault();

        const studentId = student.studentId;
        const studentName = student.studentName;
        const studentEmail = student.studentEmail;
        const mentorId = student.mentorId;

        if(studentId && studentName && studentEmail && mentorId){
            if(!emailRegex.test(studentEmail)){
                toast.add({ severity: 'error', summary: 'Error', 
                detail: 'Invalid email format. Expected format: sample.dd22@bitsathy.ac.in"',
                life: 2000 });
                return;
            }
            if(!rollNoRegex.test(studentId)){
                toast.add({ severity: 'error', summary: 'Error', 
                detail: 'Invalid roll number format. Expected format: 73762xxddnnn',
                life: 2000 });
                return;
            }

            const batch = route.params.batchName;
            const department = presentDepartmentName.value;

            try {
                const response = await axios.post('http://localhost:5000/student/addStudent', {
                    studentId,
                    studentName,
                    studentEmail,
                    department,
                    batch,
                    mentorId
                });

                if(response.status === 200){
                    const newStudent = {
                        studentId,
                        studentName,
                        studentEmail,
                        mentorId
                    }
                    students.value.push(newStudent);
                    toast.add({ severity: 'success', summary: 'Success', detail: 'Student added successfully', life: 2000 });
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    toast.add({ severity: 'error', summary: 'Error', detail: error.response.data, life: 2000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred', life: 2000 });
                }
            }
        }

        student.studentName = '';
        student.studentEmail = '';
        student.studentId = '';
        student.mentorId = '';
    }

    const downloadStudentCSVTemplate = () => {
        const header = ['studentId', 'studentName', 'studentEmail', 'mentorId'];
        const rows = [];

        const generateStudentId = () => {
            const year = '222';
            const department = 'AL';
            const randomNum = Math.floor(100 + Math.random() * 900).toString();
            return `7376${year}${department}${randomNum}`;
        };

        const generateStudentName = () => {
            const names = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Charlie Davis', 'Diana Evans', 'Eve Foster', 'Frank Green', 'Grace Harris', 'Henry Irving'];
            return names[Math.floor(Math.random() * names.length)];
        };

        const generateStudentEmail = (name: string, department: string) => {
            const emailName = name.split(' ')[0].toLowerCase();
            const year = '22';
            return `${emailName}.${department.toLowerCase()}${year}@bitsathy.ac.in`;
        };

        for (let i = 0; i < 10; i++) {
            const studentName = generateStudentName();
            const department = 'AL';
            const studentId = generateStudentId();
            const studentEmail = generateStudentEmail(studentName, department);
            const mentorId = 'M0001';
            rows.push([studentId, studentName, studentEmail, mentorId]);
        }

        const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "students_template.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleAddStudentsByCSV = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
    
        if (file) {
            studentFileName.value = file.name;
    
            Papa.parse(file, {
                header: true,
                complete: async (result: ParseResult<Student>) => {
                    const studentCSV = result.data
                        .filter((student: Student) => student.studentId && student.studentName && student.studentEmail && student.mentorId)
                        .map((student: Student) => ({
                            studentId: student.studentId,
                            studentName: student.studentName,
                            studentEmail: student.studentEmail,
                            mentorId: student.mentorId
                        }));
    
                    for (const student of studentCSV) {
                        try {
                            const response = await axios.post('http://localhost:5000/student/addStudent', {
                                studentId: student.studentId,
                                studentName: student.studentName,
                                studentEmail: student.studentEmail,
                                department: presentDepartmentName.value,
                                batch: route.params.batchName,
                                mentorId: student.mentorId
                            });
    
                            if (response.status === 200) {
                                students.value.push(student);
                                toast.add({ severity: 'success', summary: 'Success', detail: 'Student added successfully', life: 2000 });
                            }
                        } catch (error) {
                            if (axios.isAxiosError(error) && error.response) {
                                toast.add({ severity: 'error', summary: 'Error', detail: error.response.data, life: 2000 });
                            } else {
                                toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred', life: 2000 });
                            }
                        }
                    }
                },
                error: (error: Error) => {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred', life: 2000 });
                },
            });
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No file selected', life: 2000 });
        }
    };

    const fetchStudents = async() => {
        const batchName = route.params.batchName;
        const departmentName = presentDepartmentName.value;
        try {
            const response = await axios.get(`http://localhost:5000/department/getStudents/${batchName}/${departmentName}`);
            if(response.status === 200){
                students.value = response.data;
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // toast.add({ severity: 'error', summary: 'Error', detail: error.response.data, life: 2000 });
                console.log(error.response.data);
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred', life: 2000 });
            }
        }
    }

    const handleDeleteStudent = async(studentId: string) => {
        const batch = route.params.batchName;
        const department = presentDepartmentName.value;
        try {
            const response = await axios.delete(`http://localhost:5000/student/deleteStudent/${batch}/${department}/${studentId}`);
            if(response.status === 200){
                students.value = students.value.filter(student => student.studentId !== studentId);
                toast.add({ severity: 'success', summary: 'Success', detail: 'Student deleted successfully', life: 2000 });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.add({ severity: 'error', summary: 'Error', detail: error.response.data, life: 2000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred', life: 2000 });
            }
        }
    }

    onMounted(() => {
      handleGetAllDepartments();
    });

    return {
      styles,
      goBack,
      addDepartmentsModal,
      handleAddDepartment,
      toast,
      departments,
      handleDeleteDepartment,
      addStudentsModal,
      tabClicked,
      students,
      student,
      handleAddStudentsByMail,
      selectDepartment,
      deselectDepartment,
      downloadStudentCSVTemplate,
      handleAddStudentsByCSV,
      studentFileName,
      handleDeleteStudent
    }
  }
}

</script>

<template>

    <!-- add department whole -->
    <div :class="styles.addDepartments">
        <div :class="styles.addDepartments_header">
            <div :class="styles.addDepartments_header_left">    
                <button @click="goBack">
                    <i class="pi pi-arrow-circle-left"></i>
                </button>
            </div>

            <div :class="styles.addDepartments_header_right">
                <button @click="addDepartmentsModal = !addDepartmentsModal">
                    <i class="pi pi-plus-circle"></i>
                    <h1>Department</h1>
                </button>

                <Dialog
                    v-model="addDepartmentsModal"
                    header="Add Department"
                    :visible="addDepartmentsModal"
                    @update:visible="addDepartmentsModal = $event"
                    :modal="true"
                    :closable="true"
                    :showHeader="true"
                    :style="{width: '30vw', height: '35vh'}"
                >
                    <div :class="styles.addDepartments_modal_inside">
                        <form 
                            :class="styles.addDepartments_modal_inside_form"
                            @submit.prevent="handleAddDepartment"
                        >
                            <div :class="styles.input_group">
                                <input 
                                    required 
                                    type="text" 
                                    name="batchName" 
                                    autocomplete="off" 
                                    :class="styles.input"
                                >
                                <label :class="styles.user_label">Department Name</label>
                            </div>

                            <div :class="styles.addDepartments_modal_inside_form_button_container">
                                <button type="submit">Add</button>
                            </div>
                        </form>
                    </div>
                </Dialog>
                <Toast />
            </div>
        </div>
        <div :class="styles.addDepartments_main">
            <div 
                :class="styles.addDepartments_main_department_container"
                v-for="(department, index) in departments"
                :key="index"
            >
                <div :class="styles.addDepartments_main_department_container_top">
                    <h1>{{ department.name }}</h1>
                </div>
                <div :class="styles.addDepartments_main_department_container_bottom">
                    <div :class="styles.addDepartments_main_department_container_bottom_left">
                        <h1>{{ department.studentsCount }}</h1>
                    </div>
                    <div :class="styles.addDepartments_main_department_container_bottom_right">
                        <button @click="selectDepartment(department.name)">Students</button>
                        <i class="pi pi-trash" @click="handleDeleteDepartment(department.name)"></i>
                    </div>
                    <Dialog
                        v-model="addStudentsModal"
                        header="Add Students"
                        :visible="addStudentsModal"
                        @update:visible="addStudentsModal = $event"
                        :modal="true"
                        :closable="true"
                        :showHeader="true"
                        :style="{width: '80vw', height: '90vh'}"
                        @close="deselectDepartment"
                    >
                        <div :class="styles.addDepartments_main_students_inside">
                            <div :class="styles.addDepartments_main_students_inside_tabs_container">
                                <div 
                                    :class="tabClicked === 'byMail' ? styles.addDepartments_main_students_inside_tab_clicked : styles.addDepartments_main_students_inside_tab"
                                    @click="tabClicked = 'byMail'"
                                >
                                    By Mail
                                </div>
                                <div 
                                    :class="tabClicked === 'byCSV' ? styles.addDepartments_main_students_inside_tab_clicked : styles.addDepartments_main_students_inside_tab"
                                    @click="tabClicked = 'byCSV'"
                                >
                                    By CSV
                                </div>
                            </div>

                            <div 
                                :class="styles.addDepartments_main_students_inside_main"
                                v-if="tabClicked === 'byMail'"
                            >
                                <div :class="styles.addDepartments_main_students_inside_mail_container">
                                    <div :class="styles.input_group">
                                        <input 
                                            required 
                                            type="text" 
                                            name="studentName" 
                                            autocomplete="off" 
                                            :class="styles.input"
                                            v-model="student.studentName"
                                            @keyup.enter="handleAddStudentsByMail"
                                        >
                                        <label :class="styles.user_label">Name</label>
                                    </div>
                                    <div :class="styles.input_group">
                                        <input 
                                            required 
                                            type="email" 
                                            name="studentEmail" 
                                            autocomplete="off" 
                                            :class="styles.input"
                                            v-model="student.studentEmail"
                                            @keyup.enter="handleAddStudentsByMail"
                                        >
                                        <label :class="styles.user_label">Email</label>
                                    </div>
                                    <div :class="styles.input_group">
                                        <input 
                                            required 
                                            type="text" 
                                            name="studentRollNo" 
                                            autocomplete="off" 
                                            :class="styles.input"
                                            v-model="student.studentId"
                                            @keyup.enter="handleAddStudentsByMail"
                                        >
                                        <label :class="styles.user_label">Roll No</label>
                                    </div>
                                    <div :class="styles.input_group">
                                        <input 
                                            required 
                                            type="text" 
                                            name="mentorId" 
                                            autocomplete="off" 
                                            :class="styles.input"
                                            v-model="student.mentorId"
                                            @keyup.enter="handleAddStudentsByMail"
                                        >
                                        <label :class="styles.user_label">Mentor ID</label>
                                    </div>
                                </div>
                                <div :class="styles.addDepartments_main_students_inside_mail_main_container">
                                    <div 
                                        :class="styles.addDepartments_main_students_inside_student_container"
                                        v-for="(student, index) in students"
                                        :key="index"
                                    >
                                        <div :class="styles.addDepartments_main_students_inside_student_container_slno">
                                            <h1>{{ index+1 }}</h1>
                                        </div>
                                        <div :class="styles.addDepartments_main_students_inside_student_container_name">
                                            <h1>{{ student.studentName }}</h1>
                                        </div>
                                        <div :class="styles.addDepartments_main_students_inside_student_container_roll">
                                            <h1>{{ student.studentId }}</h1>
                                        </div>
                                        <div :class="styles.addDepartments_main_students_inside_student_container_email">
                                            <h1>{{ student.studentEmail }}</h1>
                                        </div>
                                        <div :class="styles.addDepartments_main_students_inside_student_container_button">
                                            <i class="pi pi-trash" @click="handleDeleteStudent(student.studentId)"></i>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>

                            <div 
                                :class="styles.addDepartments_main_students_inside_main"
                                v-if="tabClicked === 'byCSV'"
                            >
                                <div :class="styles.addDepartments_main_students_inside_student_container_CSV_top">
                                    <button @click="downloadStudentCSVTemplate">Download Template CSV</button>
                                </div>
                                <div :class="styles.addDepartments_main_students_inside_student_container_CSV_main">
                                    <div :class="styles.addDepartments_main_students_inside_student_container_CSV_main_form">
                                        <div :class="styles.addDepartments_main_students_inside_student_container_CSV_main_form_header">
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                                <g id="SVGRepo_iconCarrier">
                                                <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                </g>
                                            </svg>
                                            <p>{{ studentFileName }}</p>
                                        </div>
                                        <label for="file" :class="styles.addDepartments_main_students_inside_student_container_CSV_main_form_footer">
                                        <svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                            <g id="SVGRepo_iconCarrier">
                                            <path d="M15.331 6H8.5v20h15V14.154h-8.169z"></path>
                                            <path d="M18.153 6h-.009v5.342H23.5v-.002z"></path>
                                            </g>
                                        </svg>
                                        <p>{{ studentFileName }}</p>
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                            <g id="SVGRepo_iconCarrier">
                                            <path d="M5.16565 10.1534C5.07629 8.99181 5.99473 8 7.15975 8H16.8402C18.0053 8 18.9237 8.9918 18.8344 10.1534L18.142 19.1534C18.0619 20.1954 17.193 21 16.1479 21H7.85206C6.80699 21 5.93811 20.1954 5.85795 19.1534L5.16565 10.1534Z" stroke="#000000" stroke-width="2"></path>
                                            <path d="M19.5 5H4.5" stroke="#000000" stroke-width="2" stroke-linecap="round"></path>
                                            <path d="M10 3C10 2.44772 10.4477 2 11 2H13C13.5523 2 14 2.44772 14 3V5H10V3Z" stroke="#000000" stroke-width="2"></path>
                                            </g>
                                        </svg>
                                        </label>
                                        <input id="file" :class="styles.file" type="file" accept=".csv" @change="handleAddStudentsByCSV" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    </div>

</template>