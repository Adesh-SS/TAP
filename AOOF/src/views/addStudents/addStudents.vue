<script lang="ts">
//dependencies

import { ref, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2'

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
const addStudentsMethod = ref<string>('csv');
const students = ref<Student[]>([]);
const newStudent = ref<Student>({
  name: '',
  roll: '',
  email: '',
});
const currentDepartmentIndex = ref<number | null>(null);

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
    const departmentJson = JSON.stringify(departments.value[currentDepartmentIndex.value]);
    console.log(departmentJson);
  }
};

//export

export default {
  setup() {
    const router = useRouter();

    const navigateBack = () => {
      router.go(-1);
    }

    return {
      styles,
      navigateBack,
      departments,
      addDepartment,
      visibleAddStudentModal,
      handleModalToggle,
      addStudentsMethod,
      students,
      newStudent,
      addStudents,
      deleteStudent,
      saveStudentsByMail,
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

                  <div v-else></div>

                </div>
              </Dialog>

            </div>
        </div>
    </div>

    <!-- Footer -->

    <div :class="styles.addStudents_footer">
        <button>
            <i class="pi pi-save" />
            Save
        </button>
    </div>
  </div>
</template>