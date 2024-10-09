<script lang="ts">

//dependencies

import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

//styles

import styles from './addDepartments.module.css';

//interfaces

interface Department {
    name: string;
    studentsCount: number;
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
      handleDeleteDepartment
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
                        <button>Students</button>
                        <i class="pi pi-trash" @click="handleDeleteDepartment(department.name)"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>