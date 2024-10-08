<script lang="ts">

//dependencies

import { ref } from 'vue';
import { useRouter } from 'vue-router';

//styles

import styles from './addDepartments.module.css';

//interfaces


//exports

export default {
  setup() {

    //variables

    const router = useRouter();
    const addDepartmentsModal = ref<boolean>(false);

    //functions

    const goBack = () => {
      router.go(-1);
    }

    return {
      styles,
      goBack,
      addDepartmentsModal,
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
                    v-model:visible="addDepartmentsModal"
                    header="Add Department"
                    :modal="true"
                    :closable="true"
                    :showHeader="true"
                    :style="{width: '30vw', height: '35vh'}"
                >
                    <div :class="styles.addDepartments_modal_inside">
                        <form 
                            :class="styles.addDepartments_modal_inside_form"
                        >
                            <div :class="styles.input_group">
                                <input 
                                    required 
                                    type="text" 
                                    name="departmentName" 
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
            </div>
        </div>
    </div>

</template>