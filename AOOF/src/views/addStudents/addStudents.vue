<script lang="ts">
//dependencies

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

//styles

import styles from './addStudents.module.css';

//components

//assets

//interfaces

interface Department {
    index: number;
    departmentName: string;
    students: any[];
}

interface Student {
  name: string;
  roll: string;
  email: string;
}

//variables

const departments = ref<Department[]>([]);
const visibleAddStudentModal = ref<boolean[]>([]);
const visibleViewStudentModal = ref<boolean[]>([]);
const addStudentsMethod = ref<string>('mail');
const students = ref<Student[]>([]);
const newStudent = ref<Student>({
  name: '',
  roll: '',
  email: '',
});
const currentDepartmentIndex = ref<number | null>(null);
const fileName = ref<string>('Not selected file');
const fileCheck = ref<boolean>(false);

//functions

const addDepartment = () => {
  Swal.fire({
    title: 'Add Department',
    input: 'text',
    inputPlaceholder: 'Department ....',
    showConfirmButton: true,
    confirmButtonText: 'Create',
    icon: 'question',
  }).then((result) => {
    if (result.isConfirmed) {
      const departmentName = result.value;
      if (departmentName) {
        const isDepartmentExists = departments.value.some(
          (department) => department.departmentName === departmentName
        );
        if (!isDepartmentExists) {
          const newDepartment: Department = {
            index: departments.value.length,
            departmentName,
            students: [],
          };
          departments.value.push(newDepartment);
          visibleAddStudentModal.value.push(true);
          visibleViewStudentModal.value.push(false);
        } else {
          Swal.fire({
            title: 'Department Exists',
            text: 'Department already exists',
            icon: 'error',
          });
        }
      }
    }
  })
};

const handleModalToggle = (index: number) => {
  visibleAddStudentModal.value[index] = !visibleAddStudentModal.value[index];
};

const handleViewModalToggle = (index: number) => {
  visibleViewStudentModal.value[index] = !visibleViewStudentModal.value[index];
};

const addStudents = () => {
  const isDuplicate = students.value.some(
    (student) =>
      student.roll === newStudent.value.roll ||
      student.email === newStudent.value.email
  );

  if (isDuplicate) {
    window.alert('Duplicate roll number or email');
  } else {
    students.value.push({ ...newStudent.value });
    newStudent.value = {
      name: '',
      roll: '',
      email: '',
    };
  }
};

const deleteStudent = (index: number) => {
  students.value.splice(index, 1);
};

const saveStudentsByMail = (index: number) => {
  currentDepartmentIndex.value = index;
  if (currentDepartmentIndex.value !== null) {
    departments.value[currentDepartmentIndex.value].students = [...students.value];
    students.value = [];
    visibleAddStudentModal.value[currentDepartmentIndex.value] = false;
    // const departmentJson = JSON.stringify(departments.value[currentDepartmentIndex.value]);
  }
};

const uploadStudents = (event: Event) => {
  const inputElement = event.target as HTMLInputElement;
  if (inputElement.files && inputElement.files.length > 0) {
    const file = inputElement.files[0];
    fileName.value = file.name; 
    fileCheck.value = true;
    const reader = new FileReader();
    reader.onload = function(e) {
      if (e.target) {
        const contents = e.target.result;
        if (typeof contents === 'string') {
          const lines = contents.split('\n');
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() !== '') { // Check if the line is not empty
              const [name, roll, email] = lines[i].split(',');
              const isDuplicate = students.value.some(
                (student) =>
                  student.roll === roll ||
                  student.email === email
              );
              if (!isDuplicate) {
                students.value.push({ name, roll, email });
              }
            }
          }
        }
      }
    };
    reader.readAsText(file);
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0];
    if (file.name.endsWith('.csv')) {
      fileName.value = file.name;
      fileCheck.value = true;
      const reader = new FileReader();
      reader.onload = function(e) {
        if (e.target) {
          const contents = e.target.result;
          if (typeof contents === 'string') {
            const lines = contents.split('\n');
            for (let i = 1; i < lines.length; i++) {
              if (lines[i].trim() !== '') { // Check if the line is not empty
                const [name, roll, email] = lines[i].split(',');
                const isDuplicate = students.value.some(
                  (student) =>
                    student.roll === roll ||
                    student.email === email
                );
                if (!isDuplicate) {
                  students.value.push({ name, roll, email });
                }
              }
            }
          }
        }
      };
      reader.readAsText(file);
    } else {
      window.alert('Please upload a CSV file');
    }
  }
};

const downloadTemplate = () => {
  const csvContent = "name,roll,email\n";
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "template.csv");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const deleteStudentFromDepartment = (departmentIndex: number, studentIndex: number) => {
  const confirm = window.confirm('Are you sure you want to delete this student?');
  if (confirm) {
    departments.value[departmentIndex].students.splice(studentIndex, 1);
  }
}

const deleteDepartment = (index: number) => {
  Swal.fire({
    title: 'Delete Department',
    text: 'This action cannot be reversed!',
    icon: 'error',
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      departments.value.splice(index, 1);
      visibleAddStudentModal.value.splice(index, 1);
      visibleViewStudentModal.value.splice(index, 1);
    }
  });
}

//export

export default {
  setup() {
    const router = useRouter();

    const navigateBack = () => {
      router.go(-1);
    }

    const saveDepartment = () => {
      const departmentJson = JSON.stringify(departments.value);
      console.log(departmentJson);
      router.go(-1);
    }

    return {
      styles,
      navigateBack,
      departments,
      addDepartment,
      visibleAddStudentModal,
      visibleViewStudentModal,
      handleModalToggle,
      handleViewModalToggle,
      addStudentsMethod,
      students,
      newStudent,
      addStudents,
      deleteStudent,
      saveStudentsByMail,
      uploadStudents,
      fileName,
      handleDrop,
      fileCheck,
      downloadTemplate,
      saveDepartment,
      deleteStudentFromDepartment,
      deleteDepartment,
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
            <button @click="addDepartment">
                <i class="pi pi-plus-circle" />
                Department
            </button>
        </div>
    </div>

    <!-- Body -->

    <div :class="styles.addStudents_main">
        <div
            :class="styles.addStudents_department_display_container"
            v-for="(department, index) in departments"
            :key="index"
        >
            <div :class="styles.addStudents_department_display_first_sections">
                <h1>{{ department.index + 1 }}</h1>
            </div>
            <div :class="styles.addStudents_department_display_sections">
                <h1>{{ department.departmentName }}</h1>
            </div>
            <div :class="styles.addStudents_department_display_sections">
                <h1>Students: {{ department.students.length }}</h1>
            </div>
            <div :class="styles.addStudents_department_display_end_sections">
              <i class="pi pi-plus-circle" @click="handleModalToggle(index)" />

              <!-- Add Students Modal -->

              <Dialog
                :visible="visibleAddStudentModal[index]"
                @update:visible="handleModalToggle(index)"
                :modal="true"
                header="Add Students"
                :style="{ width: '70vw', height: '80vh'}"
              >
                <div :class="styles.addStudents_modalContent">

                  <!-- Tabs -->

                  <div :class="styles.addStudents_modal_tabs_container">
                    <div 
                      :class="addStudentsMethod === 'mail' ? styles.addStudents_modal_tabs_focus : styles.addStudents_modal_tabs"
                      @click="addStudentsMethod = 'mail'"
                    >
                      By Mail
                    </div>
                    <div 
                      :class="addStudentsMethod === 'csv' ? styles.addStudents_modal_tabs_focus : styles.addStudents_modal_tabs"
                      @click="addStudentsMethod = 'csv'"
                    >
                      By CSV
                    </div>
                  </div>

                  <!-- Add Students By Mail -->

                  <div v-if="addStudentsMethod === 'mail'">
                    <div :class="styles.addStudents_byMail_container">

                      <!-- Input Containers -->

                      <form 
                        :class="styles.addStudents_byMail_input_container"
                        @submit.prevent="addStudents"
                      >
                        <div :class="styles.input_container">
                          <input type="text" id="name" v-model="newStudent.name" required>
                          <label for="name" :class="styles.label">Student Name</label>
                          <div :class="styles.underline"></div>
                        </div>

                        <div :class="styles.input_container">
                          <input type="text" id="roll" v-model="newStudent.roll" required>
                          <label for="roll" :class="styles.label">Roll Number</label>
                          <div :class="styles.underline"></div>
                        </div>

                        <div :class="styles.input_container">
                          <input type="text" id="email" v-model="newStudent.email" required>
                          <label for="email" :class="styles.label">Mail ID</label>
                          <div :class="styles.underline"></div>
                        </div>

                        <button type="submit" style="display: none;"></button>
                      </form>

                      <!-- Students Preview -->

                      <div :class="styles.addStudents_byMail_preview_container">
                        <div 
                          v-for="(student, sIndex) in students" 
                          :key="sIndex"
                          :class="styles.addStudents_byMail_preview"
                          @click="deleteStudent(sIndex)"
                        >
                          <h1>{{ student.name }}({{ student.roll }})({{ student.email }})</h1>
                        </div>
                      </div>

                    </div>

                    <!-- Save Button -->

                    <div :class="styles.addStudents_modal_button_container">
                      <button @click="saveStudentsByMail(index)">
                        <i class="pi pi-save" />
                        Save
                      </button>
                    </div>

                  </div>

                  <!-- Add Students By CSV -->

                  <div v-else>

                    <!-- Download CSV Template -->

                    <div :class="styles.addStudents_byCSV_download_container">
                      <button @click="downloadTemplate">
                        <i class="pi pi-download" />
                        Download Template
                      </button>
                    </div>

                    <!-- Upload CSV -->
                    <div :class="styles.addStudents_byCSV_container">

                      <!-- Input Container -->

                      <div :class="styles.container"> 
                        <div :class="styles.header"
                          @dragover.prevent
                          @drop="handleDrop"
                        > 
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier"> 
                              <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> 
                            </g>
                          </svg> 
                          <p v-if="fileCheck">{{ fileName }}</p>
                          <p v-else>Drag and Drop to Upload!</p>
                        </div> 
                        <label for="file" :class="styles.footer"> 
                          <svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M15.331 6H8.5v20h15V14.154h-8.169z"></path><path d="M18.153 6h-.009v5.342H23.5v-.002z"></path></g></svg> 
                          <p>{{ fileName }}</p> 
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.16565 10.1534C5.07629 8.99181 5.99473 8 7.15975 8H16.8402C18.0053 8 18.9237 8.9918 18.8344 10.1534L18.142 19.1534C18.0619 20.1954 17.193 21 16.1479 21H7.85206C6.80699 21 5.93811 20.1954 5.85795 19.1534L5.16565 10.1534Z" stroke="#000000" stroke-width="2"></path> <path d="M19.5 5H4.5" stroke="#000000" stroke-width="2" stroke-linecap="round"></path> <path d="M10 3C10 2.44772 10.4477 2 11 2H13C13.5523 2 14 2.44772 14 3V5H10V3Z" stroke="#000000" stroke-width="2"></path> </g></svg>
                        </label> 
                        <input id="file" type="file" accept=".csv" :style="{ display: 'none' }" @change="uploadStudents">
                      </div>

                    </div>

                    <!-- Save Button -->

                    <div :class="styles.addStudents_modal_button_container">
                      <button @click="saveStudentsByMail(index)">
                        <i class="pi pi-save" />
                        Save
                      </button>
                    </div>

                  </div>

                </div>

              </Dialog>

              <i class="pi pi-eye" @click="handleViewModalToggle(index)" />

              <!-- View Students Modal -->

              <Dialog
                :visible="visibleViewStudentModal[index]"
                @update:visible="handleViewModalToggle(index)"
                :modal="true"
                header="View Students"
                :style="{ width: '70vw', height: '80vh'}"
              >
                <div :class="styles.addStudents_modalContent">
                  <div 
                    :class="styles.addStudents_viewModal_display_container"
                    v-for="(student, studentIndex) in department.students"
                    :key="studentIndex"
                  >
                    <div :class="styles.addStudents_viewModal_display_first_sections">
                      <h1>{{ studentIndex + 1 }}</h1>
                    </div>
                    <div :class="styles.addStudents_viewModal_display_sections">
                      <h1>{{ student.name }}</h1>
                    </div>
                    <div :class="styles.addStudents_viewModal_display_sections">
                      <h1>{{ student.roll }}</h1>
                    </div>
                    <div :class="styles.addStudents_viewModal_display_sections">
                      <h1>{{ student.email }}</h1>
                    </div>
                    <div :class="styles.addStudents_viewModal_display_end_sections">
                      <i class="pi pi-trash" @click="deleteStudentFromDepartment(index, studentIndex)" />
                    </div>
                  </div>
                </div>
              </Dialog>

              <!-- Delete department -->

              <i class="pi pi-trash" @click="deleteDepartment(index)" />

            </div>
        </div>
    </div>

    <!-- Footer -->

    <div :class="styles.addStudents_footer">
        <button @click="saveDepartment">
            <i class="pi pi-save" />
            Save
        </button>
    </div>
  </div>
</template>