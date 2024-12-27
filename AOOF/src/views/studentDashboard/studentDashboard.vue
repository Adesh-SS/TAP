<script lang="ts">
// Dependencies

import { ref, onMounted } from "vue";
import Swal from 'sweetalert2';
import axios from 'axios';

// Components

// Styles

import styles from './studentDashboard.module.css';

// Assets

// Interfaces

interface OnDuty {
    index: number;
    eventName: string;
    details: any[];
}

interface ODDetails {
    studentName: string;
    mentorId: string;
    splLab: string;
    type: string;
    loggerID: string;
    eventName: string;
    fromDate: string;
    toDate: string;
    description: string;
}

interface Category {
  label: string;
  code: string;
  items: Type[];
}

//Functions and variables

const sideBarSelected = ref<string>('home');
const onduties = ref<OnDuty[]>([]);
const addEventDetails = ref<boolean>();
const viewOdModal = ref<boolean[]>([]);
const odDetails = ref<ODDetails[]>([]);
const selectedType = ref<string | null>(null);
const groupedTypes = ref<Category[]>([
  {
    label: 'Technical',
    code: 'TE',
    items: [
      { label: 'All', value: 'All'},
      { label: 'Paper Presentation', value: 'Paper Presentation' },
      { label: 'Project Presentation', value: 'Project Presentation' },
      { label: 'Hackathon', value: 'Hackathon' },
      { label: 'Internship', value: 'Internship' }
    ]
  },
  {
    label: 'Non-Technical',
    code: 'NTE',
    items: [
      { label: 'Non-Technical', value: 'Non-Technical' },
    ]
  },
]);
const buttondisplay = ref<Date | null>(null);
const endDateDisplay = ref<Date | null>(null);
const description = ref<string>('');

const value = ref("");
const items = ref([]);

const searchStudent = async () => {
  const query = value.value;
  if (query) {
    try {
      const response = await axios.get(`http://localhost:5000/onduty/fetchStudent`, {
        params: {
          studentId: query
        }
      });
      items.value = response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      items.value = [];
    }
  } else {
    items.value = [];
  }
};

const addOnduty = () => {
  Swal.fire({
    title: 'Add Event',
    input: 'text',
    inputPlaceholder: 'Event Name ....',
    showConfirmButton: true,
    confirmButtonText: 'Create',
    icon: 'question',
  }).then((result) => {
    if (result.isConfirmed) {
      const eventName = result.value;
      if (eventName) {
        const isEventExists = onduties.value.some(
          (event) => event.eventName === eventName
        );
        if (!isEventExists) {
          const newEvent: OnDuty = {
            index: onduties.value.length,
            eventName,
            details: [],
          };
          onduties.value.push(newEvent);
          handleModalToggle();
        //   visibleViewStudentModal.value.push(false);
        } else {
          Swal.fire({
            title: 'Event Exists',
            text: 'Event OD Request Pending',
            icon: 'error',
          });
        }
      }
    }
  })
};

const handleModalToggle = () => {
    addEventDetails.value = !addEventDetails.value;
};

const handleViewModalToggle = (index: number) => {
    viewOdModal.value[index] = !viewOdModal.value[index];
};

const handleLogout = () => {
  localStorage.removeItem('inutile');
  localStorage.removeItem('auth');

  window.location.reload();
};

export default {
  setup() {

    return {
        styles,
        sideBarSelected,
        onduties,
        addEventDetails,
        viewOdModal,
        odDetails,
        addOnduty,
        handleModalToggle,
        handleViewModalToggle,
        selectedType,
        groupedTypes,
        buttondisplay,
        endDateDisplay,
        description,
        handleLogout,
        value,
        items,
        searchStudent
    };
  }
};
</script>

<template>
    <div :class="styles.studentDashboard_container">

        <!-- Side Bar -->

        <div :class="styles.studentDashboard_sidebar">

            <!-- Home, Add, Report tabs -->

            <div :class="styles.studentDashboard_sidebar_first_half">
                <div 
                    :class="sideBarSelected === 'home' ? styles.studentDashboard_sidebar_icon_focus_container : styles.studentDashboard_sidebar_icon_container"
                    @click="sideBarSelected = 'home'"
                >
                    <i class="pi pi-home"></i>
                </div>
            </div>

            <!-- Profile, Logout -->

            <div :class="styles.studentDashboard_sidebar_second_half">
                <div 
                    :class="sideBarSelected === 'Profile' ? styles.studentDashboard_sidebar_icon_focus_container : styles.studentDashboard_sidebar_icon_container"
                    @click="sideBarSelected = 'Profile'"
                >
                    <i class="pi pi-user"></i>
                </div>
                <div 
                    :class="sideBarSelected === 'Logout' ? styles.studentDashboard_sidebar_icon_focus_container : styles.studentDashboard_sidebar_icon_container"
                    @click="handleLogout"
                >
                    <i class="pi pi-sign-out"></i>
                </div>
            </div>
        </div>

        <!-- Main Content -->

        <div :class="styles.studentDashboard_rest_container">

            <!-- Header -->

            <div :class="styles.studentDashboard_header">
                <h1>Apply On-duty</h1>
                <div :class="styles.studentDashboard_apply_container">
                    <button @click="addOnduty">
                        <i class="pi pi-plus-circle"></i>
                        On-Duty
                    </button>
                </div>
            </div>

            <!-- Apply OD Modal -->

            <Dialog
              :visible="addEventDetails"
              @update:visible="handleModalToggle"
              :modal="true"
              header="Add OD"
              :style="{ width: '70vw', height: '80vh'}"
            >
                <div :class="styles.studentDashboard_modalContent">
                    <div :class="styles.studentDashboard_modalContent_container">
                        <div :class="styles.studentDashboard_modalContent_container_student_input">
                            <label>Student:</label>
                            <AutoComplete v-model="value" dropdown :suggestions="items" @complete="searchStudent" />
                        </div>
                        <div :class="styles.studentDashboard_modalContent_container_staff_input">
                            <label>Mentor ID</label>
                            <input type="text" placeholder="Mentor ID" />
                        </div>
                        <div :class="styles.studentDashboard_modalContent_container_staff_input">
                            <label>Special Lab</label>
                            <input type="text" placeholder="Special Lab" />
                        </div>
                        <div :class="styles.studentDashboard_modalContent_container_student_event_type">
                            <Dropdown v-model="selectedType" :options="groupedTypes" optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" placeholder="Event Type" class="w-full md:w-14rem">
                                <template #optiongroup="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps.option.label }}</div>
                                </div>
                                </template>
                            </Dropdown>
                            <Calendar v-model="buttondisplay" showIcon :showOnFocus="false" inputId="buttondisplay" dateFormat="dd/mm/yy" placeholder="From Date - dd/mm/yyyy" />
                            <Calendar v-model="endDateDisplay" showIcon :showOnFocus="false" inputId="enddisplay" dateFormat="dd/mm/yy" placeholder="To Date - dd/mm/yyyy" />
                        </div>
                    </div>
                    <div :class="styles.studentDashboard_modalContent_container">
                        <div :class="styles.studentDashboard_modalContent_container_event_holder">
                            <label>Logger ID</label>
                            <input type="text" placeholder="Logger ID" />
                        </div>
                        <div :class="styles.studentDashboard_modalContent_container_event_holder">
                            <label>Event Name</label>
                            <input type="text" placeholder="Event Name" />
                        </div>
                        <div :class="styles.studentDashboard_modalContent_container_event_holder">
                            <label>Description</label>
                            <Textarea v-model="description" autoResize rows="5" cols="30" />
                        </div>
                    </div>
                    <div :class="styles.studentDashboard_modelContent_button_container">
                        <button
                          :class="styles.studentDashboard_modelContent_button_container_cancel_button"
                        >Cancel</button>
                        <button
                          :class="styles.studentDashboard_modelContent_button_container_submit_button"
                        >Submit</button>
                    </div>
                </div>
            </Dialog>

            <!-- Content -->

            <div :class="styles.studentDashboard_content_container">
                <add-od />
            </div>
        </div>
    </div>


</template>