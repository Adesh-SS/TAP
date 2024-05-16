<script lang="ts">
// dependencies

import { ref } from 'vue';
import { useRouter } from 'vue-router';

// styles

import styles from './addUsers.module.css';

// components

//assets

//interfaces

interface Mentors {
  name: string;
  mid: string;
  email: string;
}

interface Incharges {
  name: string;
  sid: string;
  email: string;
}

//variables

const selectedTab = ref<string>('students');
const visibleAddMentorModal = ref<boolean>(false);
const visibleAddInchargeModal = ref<boolean>(false);
const addMentorsMethod = ref<string>('mail');
const addInchargeMethod = ref<string>('mail');
const mentors = ref<Mentors[]>([]);
const incharges = ref<Incharges[]>([]);
const newMentor = ref<Mentors>({
  name: '',
  mid: '',
  email: '',
});
const newIncharge = ref<Incharges>({
  name: '',
  sid: '',
  email: '',
});
const fileName = ref<string>('Not selected file');
const fileCheck = ref<boolean>(false);
const inChargeFileName = ref<string>('Not selected file');
const inChargeFileCheck = ref<boolean>(false);

//functions

const addMentors = () => {
  const isDuplicate = mentors.value.some(
    (mentor) =>
      mentor.mid === newMentor.value.mid ||
      mentor.email === newMentor.value.email
  );

  if (isDuplicate) {
    window.alert('Duplicate mentor ID or email');
  } else {
    mentors.value.push({ ...newMentor.value });
    newMentor.value = {
      name: '',
      mid: '',
      email: '',
    };
  }
};

const addIncharge = () => {
    const isDuplicate = incharges.value.some(
        (incharge) =>
        incharge.sid === newIncharge.value.sid ||
        incharge.email === newIncharge.value.email
    );
    
    if (isDuplicate) {
        window.alert('Duplicate incharge ID or email');
    } else {
        incharges.value.push({ ...newIncharge.value });
        newIncharge.value = {
        name: '',
        sid: '',
        email: '',
        };
    }
};

const deleteMentors = (index: number) => {
  mentors.value.splice(index, 1);
};

const deleteIncharges = (index: number) => {
    incharges.value.splice(index, 1);
};

const saveMentorsByMail = () => {
  const mentorsData = mentors.value.map((mentor: Mentors) => ({
    name: mentor.name,
    mid: mentor.mid,
    email: mentor.email
  }));
  const mentorsJson = JSON.stringify(mentorsData);
  console.log(mentorsJson);
  visibleAddMentorModal.value = false;
};

const saveInchargesByMail = () => {
    const inchargesData = incharges.value.map((incharge: Incharges) => ({
        name: incharge.name,
        sid: incharge.sid,
        email: incharge.email
    }));
    const inchargesJson = JSON.stringify(inchargesData);
    console.log(inchargesJson);
    visibleAddInchargeModal.value = false;
};

const downloadTemplate = () => {
  const csvContent = "name,mid,email\n";
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "template.csv");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadInchargeTemplate = () => {
    const csvContent = "name,sid,email\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const uploadMentors = (event: Event) => {
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
              const [name, mid, email] = lines[i].split(',');
              const isDuplicate = mentors.value.some(
                (mentor) =>
                  mentor.mid === mid ||
                  mentor.email === email
              );
              if (!isDuplicate) {
                mentors.value.push({ name, mid, email });
              }
            }
          }
        }
      }
    };
    reader.readAsText(file);
  }
};

const uploadIncharges = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
        const file = inputElement.files[0];
        inChargeFileName.value = file.name; 
        inChargeFileCheck.value = true;
        const reader = new FileReader();
        reader.onload = function(e) {
            if (e.target) {
                const contents = e.target.result;
                if (typeof contents === 'string') {
                    const lines = contents.split('\n');
                    for (let i = 1; i < lines.length; i++) {
                        if (lines[i].trim() !== '') { // Check if the line is not empty
                            const [name, sid, email] = lines[i].split(',');
                            const isDuplicate = incharges.value.some(
                                (incharge) =>
                                incharge.sid === sid ||
                                incharge.email === email
                            );
                            if (!isDuplicate) {
                                incharges.value.push({ name, sid, email });
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
                const [name, mid, email] = lines[i].split(',');
                const isDuplicate = mentors.value.some(
                  (mentor) =>
                    mentor.mid === mid ||
                    mentor.email === email
                );
                if (!isDuplicate) {
                  mentors.value.push({ name, mid, email });
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

const handleInchargeDrop = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
        const file = event.dataTransfer.files[0];
        if (file.name.endsWith('.csv')) {
            inChargeFileName.value = file.name;
            inChargeFileCheck.value = true;
            const reader = new FileReader();
            reader.onload = function(e) {
                if (e.target) {
                    const contents = e.target.result;
                    if (typeof contents === 'string') {
                        const lines = contents.split('\n');
                        for (let i = 1; i < lines.length; i++) {
                            if (lines[i].trim() !== '') { // Check if the line is not empty
                                const [name, sid, email] = lines[i].split(',');
                                const isDuplicate = incharges.value.some(
                                    (incharge) =>
                                    incharge.sid === sid ||
                                    incharge.email === email
                                );
                                if (!isDuplicate) {
                                    incharges.value.push({ name, sid, email });
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

//exports

export default {
    setup(){
        const router = useRouter();

        const navigateTo = (path: string) => {
            router.push(`admin/${path}`);
        };
        
        return {
            styles,
            selectedTab,
            navigateTo,
            visibleAddMentorModal,
            addMentorsMethod,
            mentors,
            newMentor,
            addMentors,
            deleteMentors,
            saveMentorsByMail,
            downloadTemplate,
            uploadMentors,
            handleDrop,
            fileName,
            fileCheck,
            visibleAddInchargeModal,
            addInchargeMethod,
            incharges,
            newIncharge,
            addIncharge,
            deleteIncharges,
            saveInchargesByMail,
            downloadInchargeTemplate,
            uploadIncharges,
            handleInchargeDrop,
            inChargeFileName,
            inChargeFileCheck
        };
    }
}
</script>

<template>
    <div :class="styles.addUsers_container">

        <!-- Tabs: students, mentors, in-charges -->

        <div :class="styles.addUser_tab_container">
            <div 
                :class="selectedTab === 'students' ? styles.addUser_tab_rectangle_focus : styles.addUser_tab_rectangle"
                @click="selectedTab = 'students'"
            >
                <h1>Students</h1>
            </div>
            <div 
                :class="selectedTab === 'mentors' ? styles.addUser_tab_rectangle_focus : styles.addUser_tab_rectangle"
                @click="selectedTab = 'mentors'"
            >
                <h1>Mentors</h1>
            </div>
            <div 
                :class="selectedTab === 'specials' ? styles.addUser_tab_rectangle_focus : styles.addUser_tab_rectangle"
                @click="selectedTab = 'specials'"
            >
                <h1>In-charge</h1>
            </div>
        </div>

        <!-- Tab respective containers -->

        <div :class="styles.addUser_details_container">
            
            <!-- Students -->

            <div v-if="selectedTab === 'students'">
                <div :class="styles.addUser_students_year_container">
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>First Year</h1>
                    </div>
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Departments:</h1>
                        <p>00</p>
                    </div>
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Students:</h1>
                        <p>00</p>
                    </div>
                    <i class="pi pi-eye" @click="navigateTo('firstYear')"></i>
                </div>
                <div :class="styles.addUser_students_year_container">
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Second Year</h1>
                    </div>
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Departments:</h1>
                        <p>00</p>
                    </div>
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Students:</h1>
                        <p>00</p>
                    </div>
                    <i class="pi pi-eye" @click="navigateTo('secondYear')"></i>
                </div>
                <div :class="styles.addUser_students_year_container">
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Third Year</h1>
                    </div>
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Departments:</h1>
                        <p>00</p>
                    </div>
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Students:</h1>
                        <p>00</p>
                    </div>
                    <i class="pi pi-eye" @click="navigateTo('thirdYear')"></i>
                </div>
                <div :class="styles.addUser_students_year_container">
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Final Year</h1>
                    </div>
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Departments:</h1>
                        <p>00</p>
                    </div>
                    <div :class="styles.addUser_students_year_rectangle">
                        <h1>Students:</h1>
                        <p>00</p>
                    </div>
                    <i class="pi pi-eye" @click="navigateTo('finalYear')"></i>
                </div>
            </div>

            <!-- Mentors -->

            <div v-if="selectedTab === 'mentors'">

                <!-- Add Mentor Button -->

                <div :class="styles.addUser_mentor_add_container">
                    <h1>Mentors: {{ mentors.length }}</h1>
                    <button @click="visibleAddMentorModal = true">
                        <i class="pi pi-plus-circle"></i>
                        Mentors
                    </button>
                </div>

                <!-- Mentor Details Container -->

                <div :class="styles.addUser_mentor_details_container">
                    <Dialog
                        v-model="visibleAddMentorModal"
                        header="Add Mentor"
                        :visible="visibleAddMentorModal"
                        :modal="true"
                        @update:visible="visibleAddMentorModal = $event"
                        :style="{ width: '80vw', height: '90vh'}"
                    >
                        <div :class="styles.addUser_mentor_modalContent">

                            <!-- Tabs for adding mentors by mail or csv -->

                            <div :class="styles.addUser_mentor_modal_tabs_container">
                                <div 
                                :class="addMentorsMethod === 'mail' ? styles.addUser_mentor_modal_tabs_focus : styles.addUser_mentor_modal_tabs"
                                @click="addMentorsMethod = 'mail'"
                                >
                                By Mail
                                </div>
                                <div 
                                :class="addMentorsMethod === 'csv' ? styles.addUser_mentor_modal_tabs_focus : styles.addUser_mentor_modal_tabs"
                                @click="addMentorsMethod = 'csv'"
                                >
                                By CSV
                                </div>
                            </div>

                            <!-- Add mentor by mail -->

                            <div v-if="addMentorsMethod === 'mail'">
                                <div :class="styles.addUser_mentor_byMail_container">

                                <!-- Input Containers -->

                                <form 
                                    :class="styles.addUser_mentor_byMail_input_container"
                                    @submit.prevent="addMentors"
                                >
                                    <div :class="styles.input_container">
                                        <input type="text" id="name" v-model="newMentor.name" required>
                                        <label for="name" :class="styles.label">Mentor Name</label>
                                        <div :class="styles.underline"></div>
                                    </div>

                                    <div :class="styles.input_container">
                                        <input type="text" id="mid" v-model="newMentor.mid" required>
                                        <label for="mid" :class="styles.label">Mentor ID</label>
                                        <div :class="styles.underline"></div>
                                    </div>

                                    <div :class="styles.input_container">
                                        <input type="text" id="email" v-model="newMentor.email" required>
                                        <label for="email" :class="styles.label">Mail ID</label>
                                        <div :class="styles.underline"></div>
                                    </div>

                                    <button type="submit" style="display: none;"></button>
                                </form>

                                <!-- Students Preview -->

                                <div :class="styles.addUser_mentor_preview_container">
                                    <div 
                                    v-for="(mentor, mIndex) in mentors" 
                                    :key="mIndex"
                                    :class="styles.addUser_mentor_preview"
                                    @click="deleteMentors(mIndex)"
                                    >
                                    <h1>{{ mentor.name }}({{ mentor.mid }})({{ mentor.email }})</h1>
                                    </div>
                                </div>

                                </div>

                                <!-- Save Button -->

                                <div :class="styles.addUser_modal_button_container">
                                    <button @click="saveMentorsByMail">
                                        <i class="pi pi-save" />
                                        Save
                                    </button>
                                </div>

                            </div>

                            <!-- Add mentor by CSV -->

                            <div v-else>

                                <!-- Download CSV Template -->

                                <div :class="styles.addUser_modal_byCSV_download_container">
                                    <button @click="downloadTemplate">
                                        <i class="pi pi-download" />
                                        Download Template
                                    </button>
                                </div>

                                <!-- Upload CSV -->
                                <div :class="styles.addUser_byCSV_container">

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
                                        <input id="file" type="file" accept=".csv" :style="{ display: 'none' }" @change="uploadMentors">
                                    </div>

                                </div>

                                <!-- Save Button -->

                                <div :class="styles.addUser_modal_button_container">
                                    <button @click="saveMentorsByMail">
                                        <i class="pi pi-save" />
                                        Save
                                    </button>
                                </div>
                            </div>

                        </div>
                    </Dialog>

                    <!-- Mentor Display -->

                    <div :class="styles.addUser_mentors_display_container">
                        <div 
                        v-for="(mentor, mIndex) in mentors" 
                        :key="mIndex"
                        :class="styles.addUser_mentors_display"
                        >
                            <h1>{{ mIndex + 1 }}</h1>
                            <h1>{{ mentor.name }}</h1>
                            <h1>{{ mentor.mid }}</h1>
                            <h1>{{ mentor.email }}</h1>
                            <i class="pi pi-trash" @click="deleteMentors(mIndex)"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- In-charges -->

            <div v-if="selectedTab === 'specials'">

                <!-- Add In-charge Button -->

                <div :class="styles.addUser_incharge_add_container">
                    <h1>In-charge: {{ incharges.length }}</h1>
                    <button @click="visibleAddInchargeModal = true">
                        <i class="pi pi-plus-circle"></i>
                        In-charge
                    </button>
                </div>

                <!-- In-charge Details Container -->

                <div :class="styles.addUser_incharge_details_container">
                    <Dialog
                        v-model="visibleAddInchargeModal"
                        header="Add Special Lab Incharge"
                        :visible="visibleAddInchargeModal"
                        :modal="true"
                        @update:visible="visibleAddInchargeModal = $event"
                        :style="{ width: '80vw', height: '90vh'}"
                    >
                        <div :class="styles.addUser_mentor_modalContent">

                            <!-- Tabs for adding mentors by mail or csv -->

                            <div :class="styles.addUser_mentor_modal_tabs_container">
                                <div 
                                :class="addMentorsMethod === 'mail' ? styles.addUser_mentor_modal_tabs_focus : styles.addUser_mentor_modal_tabs"
                                @click="addMentorsMethod = 'mail'"
                                >
                                By Mail
                                </div>
                                <div 
                                :class="addMentorsMethod === 'csv' ? styles.addUser_mentor_modal_tabs_focus : styles.addUser_mentor_modal_tabs"
                                @click="addMentorsMethod = 'csv'"
                                >
                                By CSV
                                </div>
                            </div>

                            <!-- Add mentor by mail -->

                            <div v-if="addMentorsMethod === 'mail'">
                                <div :class="styles.addUser_mentor_byMail_container">

                                <!-- Input Containers -->

                                <form 
                                    :class="styles.addUser_mentor_byMail_input_container"
                                    @submit.prevent="addIncharge"
                                >
                                    <div :class="styles.input_container">
                                        <input type="text" id="name" v-model="newIncharge.name" required>
                                        <label for="name" :class="styles.label">In-charge Name</label>
                                        <div :class="styles.underline"></div>
                                    </div>

                                    <div :class="styles.input_container">
                                        <input type="text" id="mid" v-model="newIncharge.sid" required>
                                        <label for="mid" :class="styles.label">In-charge ID</label>
                                        <div :class="styles.underline"></div>
                                    </div>

                                    <div :class="styles.input_container">
                                        <input type="text" id="email" v-model="newIncharge.email" required>
                                        <label for="email" :class="styles.label">Mail ID</label>
                                        <div :class="styles.underline"></div>
                                    </div>

                                    <button type="submit" style="display: none;"></button>
                                </form>

                                <!-- Incharges Preview -->

                                <div :class="styles.addUser_mentor_preview_container">
                                    <div 
                                    v-for="(incharge, iIndex) in incharges" 
                                    :key="iIndex"
                                    :class="styles.addUser_mentor_preview"
                                    @click="deleteMentors(iIndex)"
                                    >
                                    <h1>{{ incharge.name }}({{ incharge.sid }})({{ incharge.email }})</h1>
                                    </div>
                                </div>

                                </div>

                                <!-- Save Button -->

                                <div :class="styles.addUser_modal_button_container">
                                    <button @click="saveInchargesByMail">
                                        <i class="pi pi-save" />
                                        Save
                                    </button>
                                </div>

                            </div>

                            <!-- Add mentor by CSV -->

                            <div v-else>

                                <!-- Download CSV Template -->

                                <div :class="styles.addUser_modal_byCSV_download_container">
                                    <button @click="downloadInchargeTemplate">
                                        <i class="pi pi-download" />
                                        Download Template
                                    </button>
                                </div>

                                <!-- Upload CSV -->
                                <div :class="styles.addUser_byCSV_container">

                                    <!-- Input Container -->

                                    <div :class="styles.container"> 
                                        <div :class="styles.header"
                                            @dragover.prevent
                                            @drop="handleInchargeDrop"
                                        > 
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                            <g id="SVGRepo_iconCarrier"> 
                                                <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> 
                                            </g>
                                            </svg> 
                                            <p v-if="inChargeFileCheck">{{ inChargeFileName }}</p>
                                            <p v-else>Drag and Drop to Upload!</p>
                                        </div> 
                                        <label for="file" :class="styles.footer"> 
                                            <svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M15.331 6H8.5v20h15V14.154h-8.169z"></path><path d="M18.153 6h-.009v5.342H23.5v-.002z"></path></g></svg> 
                                            <p>{{ inChargeFileName }}</p> 
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.16565 10.1534C5.07629 8.99181 5.99473 8 7.15975 8H16.8402C18.0053 8 18.9237 8.9918 18.8344 10.1534L18.142 19.1534C18.0619 20.1954 17.193 21 16.1479 21H7.85206C6.80699 21 5.93811 20.1954 5.85795 19.1534L5.16565 10.1534Z" stroke="#000000" stroke-width="2"></path> <path d="M19.5 5H4.5" stroke="#000000" stroke-width="2" stroke-linecap="round"></path> <path d="M10 3C10 2.44772 10.4477 2 11 2H13C13.5523 2 14 2.44772 14 3V5H10V3Z" stroke="#000000" stroke-width="2"></path> </g></svg>
                                        </label> 
                                        <input id="file" type="file" accept=".csv" :style="{ display: 'none' }" @change="uploadIncharges">
                                    </div>

                                </div>

                                <!-- Save Button -->

                                <div :class="styles.addUser_modal_button_container">
                                    <button @click="saveInchargesByMail">
                                        <i class="pi pi-save" />
                                        Save
                                    </button>
                                </div>
                            </div>

                        </div>
                    </Dialog>

                    <!-- In-charge Display -->

                    <div :class="styles.addUser_mentors_display_container">
                        <div 
                        v-for="(incharge, iIndex) in incharges" 
                        :key="iIndex"
                        :class="styles.addUser_mentors_display"
                        >
                            <h1>{{ iIndex + 1 }}</h1>
                            <h1>{{ incharge.name }}</h1>
                            <h1>{{ incharge.sid }}</h1>
                            <h1>{{ incharge.email }}</h1>
                            <i class="pi pi-trash" @click="deleteMentors(iIndex)"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>