<script lang="ts">
// Dependencies

import { ref, onMounted } from "vue";
import Swal from 'sweetalert2';

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

//Functions and variables

const sideBarSelected = ref<string>('home');
const onduties = ref<OnDuty[]>([]);
const addEventDetails = ref<boolean>();
const viewOdModal = ref<boolean[]>([]);
const odDetails = ref<ODDetails[]>([]);

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
                    @click="sideBarSelected = 'Logout'"
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
              header="Add Students"
              :style="{ width: '70vw', height: '80vh'}"
            >
                <div :class="styles.studentDashboard_modal_container">
                    <div :class="styles.studentDashboard_modal_content_container">
                        <div :class="styles.studentDashboard_modal_content_body">
                            <div :class="styles.studentDashboard_modal_content_body_container">
                                <div :class="styles.studentDashboard_modal_content_body_container_input">
                                    <label>Student(Roll Number)(Mail)</label>
                                    <input type="text" placeholder="Student.." />
                                </div>
                                <div :class="styles.studentDashboard_modal_content_body_container_input">
                                    <label>Event Name</label>
                                    <input type="text" placeholder="Event Name" />
                                </div>
                                <div :class="styles.studentDashboard_modal_content_body_container_input">
                                    <label>From Date</label>
                                    <input type="date" />
                                </div>
                                <div :class="styles.studentDashboard_modal_content_body_container_input">
                                    <label>To Date</label>
                                    <input type="date" />
                                </div>
                                <div :class="styles.studentDashboard_modal_content_body_container_input">
                                    <label>Description</label>
                                    <textarea placeholder="Description"></textarea>
                                </div>
                            </div>
                            <div :class="styles.studentDashboard_modal_content_body_container">
                                <div :class="styles.studentDashboard_modal_content_body_container_input">
                                    <label>Special Lab</label>
                                    <input type="text" placeholder="Special Lab" />
                                </div>
                                <div :class="styles.studentDashboard_modal_content_body_container_input">
                                    <label>OD Type</label>
                                    <select>
                                        <option value="1">Technical</option>
                                        <option value="2">Non - Technical</option>
                                    </select>
                                </div>
                                <div :class="styles.studentDashboard_modal_content_body_container_input">
                                    <label>Logger ID</label>
                                    <input type="text" placeholder="Logger ID" />
                                </div>
                                <div :class="styles.studentDashboard_modal_content_body_container_input">
                                    <label>Mentor ID</label>
                                    <input type="text" placeholder="Mentor ID" />
                                </div>
                            </div>
                        </div>
                        <div :class="styles.studentDashboard_modal_content_footer">
                            <button>Submit</button>
                        </div>
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