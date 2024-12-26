<script lang="ts">
//Dependencies

import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import Papa from 'papaparse';
import { ParseResult } from 'papaparse';

//Components

//Styles

import styles from './adminPage.module.css';

//Assets

//Interfaces

interface Batch {
    name: string;
    studentsCount: number;
}

interface Mentor {
    mentorId: string;
    mentorName: string;
    mentorEmail: string;
}

interface Mentees {
    studentId: string;
    studentName: string;
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

//Exports

export default{
    components: {
        Toast
    },
    setup() {
        //variables

        const sideBarSelected = ref<string>('addressBook');
        const value = ref<string>("");
        const items = ref<string[]>([]);
        const addUserTab = ref<string>('students');
        const batches = ref<Batch[]>([]);
        const addBatchModel = ref<boolean>(false);
        const toast = useToast();
        const router = useRouter();
        const addMentorModel = ref<boolean>(false);
        const mentorTab = ref<string>('byMail');
        const mentors = ref<Mentor[]>([]);
        const mentor = reactive<Mentor>({
            mentorId: '',
            mentorName: '',
            mentorEmail: ''
        });
        const mentorFileName = ref<string>('Browse for file');
        const showMenteesModal = ref<boolean>(false);
        const mentees  = ref<Mentees[]>([]);


        const chartData = ref<any>();
        const chartOptions = ref<any>();

        // get the following values from the backend server

        const firstYearCount = ref<number>(540);
        const secondYearCount = ref<number>(325);
        const thirdYearCount = ref<number>(602);
        const finalYearCount = ref<number>(404);

        const setChartData = (): any => {
            const documentStyle = getComputedStyle(document.body);

            return {
                labels: ['First Year', 'Second Year', 'Third Year', 'Final Year'],
                datasets: [
                    {
                        data: [540, 325, 602, 404],
                        backgroundColor: [documentStyle.getPropertyValue('--cyan-500'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--gray-500'), documentStyle.getPropertyValue('--yellow-500')], 
                        hoverBackgroundColor: [documentStyle.getPropertyValue('--cyan-400'), documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--gray-400'), documentStyle.getPropertyValue('--yellow-400')],
                    }
                ]
            };
        };

        const setChartOptions = (): any => {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');

            return {
                plugins: {
                    legend: {
                        labels: {
                            cutout: '60%',
                            color: textColor
                        }
                    }
                }
            };
        };

        //Functions

        const search = (event : {query: string}) => {
            items.value = [...Array(10).keys()].map((item) => event.query + '-' + item);
        }

        const handleLogout = () => {
            localStorage.removeItem('inutile');
            localStorage.removeItem('auth');

            window.location.reload();
        }

        const handleAddBatch = async(event: Event) => {
            event.preventDefault();

            const name = (event.target as HTMLFormElement).batchName.value;
            
            if(name.length === 9){
                try {
                    const response = await axios.post('http://localhost:5000/batch/addBatch', {
                        name
                    });

                    if(response.status === 200){
                        addBatchModel.value = false;
                        (event.target as HTMLFormElement).reset();
                        const newBatch = { name, studentsCount: 0 }; // Assuming new batch has 0 students initially
                        batches.value.push(newBatch);
                        toast.add({severity:'success', summary: 'Success', detail: 'Batch added successfully', life: 2000});
                    }
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) {
                        toast.add({ severity: 'error', summary: 'Error', detail: error.response.data, life: 2000 });
                    } else {
                        toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred', life: 2000 });
                    }
                }
            } else {
                toast.add({severity:'error', summary: 'Error', detail: 'Batch name should be of 9 characters', life: 2000});
            }
        }
        
        const fetchBranches = async() => {
            try {
                const response = await axios.get('http://localhost:5000/batch/getBatches');
                const branches = response.data.map((batch: Batch) => ({
                    name: batch.name,
                    studentsCount: batch.studentsCount
                }));

                batches.value.push(...branches);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    toast.add({ severity: 'error', summary: 'Error', detail: error.response.data, life: 2000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred', life: 2000 });
                }
            }
        }

        const handleDeleteBatch = async(name: string) => {
            try {
                const response = await axios.delete(`http://localhost:5000/batch/deleteBatch/${name}`);

                if(response.status === 200){
                    batches.value = batches.value.filter((batch) => batch.name !== name);
                    toast.add({severity:'success', summary: 'Success', detail: 'Batch deleted successfully', life: 2000});
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    toast.add({ severity: 'error', summary: 'Error', detail: error.response.data, life: 2000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred', life: 2000 });
                }
            }
        }

        const handleNavigateToBatch = (name: string) => {
            router.push({ name: 'Add Departments', params: { batchName: name } });
        }

        const handleAddMentorByMail = async(event: Event) => {
            event.preventDefault();

            const mentorId = mentor.mentorId;
            const mentorName = mentor.mentorName;
            const mentorEmail = mentor.mentorEmail;

            if(mentorId && mentorName && mentorEmail){
                try {
                    const response = await axios.post('http://localhost:5000/mentor/addMentor', {
                        mentorId,
                        mentorName,
                        mentorEmail
                    });

                    if(response.status === 200){
                        const newMentor = { mentorId, mentorName, mentorEmail };
                        mentors.value.push(newMentor);
                        mentor.mentorId = '';
                        mentor.mentorName = '';
                        mentor.mentorEmail = '';
                        toast.add({severity:'success', summary: 'Success', detail: 'Mentor added successfully', life: 2000});
                    }
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) {
                        toast.add({ severity: 'error', summary: 'Error', detail: error.response.data, life: 2000 });
                    } else {
                        toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred', life: 2000 });
                    }
                }
            } else {
                toast.add({severity:'error', summary: 'Error', detail: 'All fields are required', life: 2000});
            }
        }

        const downloadMentorCSV = () => {
            const headers = ['mentorId', 'mentorName', 'mentorEmail'];
            const rows = [];

            for(let i = 0; i < 10; i++){
                const mentorId = `M${Math.floor(1000 + Math.random() * 9000)}`;
                const mentorName = `Mentor ${i + 1}`;
                const mentorEmail = `mentor${i + 1}@bitsathy.ac.in`;
                rows.push([mentorId, mentorName, mentorEmail]);
            }

            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += headers.join(",") + "\n";
            rows.forEach((row) => {
                csvContent += row.join(",") + "\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "mentors.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        const handleMentorCSVUpload = (event: Event) => {
          const input = event.target as HTMLInputElement;
          const file = input?.files?.[0];
        
          if (file) {
            mentorFileName.value = file.name;
            Papa.parse(file, {
              header: true,
              complete: (result: ParseResult<Mentor>) => {
                const mentorCSV = result.data
                  .filter((mentor: Mentor) => mentor.mentorId && mentor.mentorName && mentor.mentorEmail) // Filter out empty rows
                  .map((mentor: Mentor) => ({
                    mentorId: mentor.mentorId,
                    mentorName: mentor.mentorName,
                    mentorEmail: mentor.mentorEmail,
                  }));
        
                mentorCSV.forEach((mentor: Mentor) => {
                  axios.post('http://localhost:5000/mentor/addMentor', {
                    mentorId: mentor.mentorId,
                    mentorName: mentor.mentorName,
                    mentorEmail: mentor.mentorEmail,
                  })
                  .then(response => {
                    toast.add({severity:'success', summary: 'Success', detail: 'Mentor added successfully', life: 2000});
                  })
                  .catch(error => {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred', life: 2000 });
                  });
        
                  mentors.value.push(mentor);
                });
        
                console.log(mentors.value);
              },
              error: (error: Error) => {
                toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred', life: 2000 });
              },
            });
          } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a file', life: 2000 });
          }
        }

        const fetchMentors = async() => {
            try {
                const response = await axios.get('http://localhost:5000/mentor/getMentors');
                const mentorsData = response.data.map((mentor: Mentor) => ({
                    mentorId: mentor.mentorId,
                    mentorName: mentor.mentorName,
                    mentorEmail: mentor.mentorEmail
                }));

                mentors.value.push(...mentorsData);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    toast.add({ severity: 'error', summary: 'Error', detail: error.response.data, life: 2000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred', life: 2000 });
                }
            }
        }

        const handleDeleteMentor = async(mentorId: string) => {
            try {
                const response = await axios.delete(`http://localhost:5000/mentor/deleteMentor/${mentorId}`);

                if(response.status === 200){
                    mentors.value = mentors.value.filter((mentor) => mentor.mentorId !== mentorId);
                    toast.add({severity:'success', summary: 'Success', detail: 'Mentor deleted successfully', life: 2000});
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    toast.add({ severity: 'error', summary: 'Error', detail: error.response.data, life: 2000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred', life: 2000 });
                }
            }
        }

        const handleMenteesModal = (mentorId: string) => {
            showMenteesModal.value = !showMenteesModal.value;
            fetchMentees(mentorId);
        }

        const fetchMentees = async(mentorId: string) => {
            try {
                const response = await axios.get(`http://localhost:5000/mentor/getMentees/${mentorId}`);
                const menteesData = response.data.map((mentee: Mentees) => ({
                    studentId: mentee.studentId,
                    studentName: mentee.studentName
                }));

                mentees.value.push(...menteesData);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    toast.add({ severity: 'error', summary: 'Error', detail: error.response.data, life: 2000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred', life: 2000 });
                }
            }
        }

        onMounted(() => {
            chartData.value = setChartData();
            chartOptions.value = setChartOptions();
            fetchBranches();
            fetchMentors();
        });
        
       return {
        styles,
        sideBarSelected,
        value,
        items,
        search,
        handleLogout,
        chartData,
        chartOptions,
        firstYearCount,
        secondYearCount,
        thirdYearCount,
        finalYearCount,
        addUserTab,
        batches,
        addBatchModel,
        handleAddBatch,
        toast,
        handleDeleteBatch,
        handleNavigateToBatch,
        addMentorModel,
        mentorTab,
        mentors,
        mentor,
        handleAddMentorByMail,
        downloadMentorCSV,
        handleMentorCSVUpload,
        mentorFileName,
        handleDeleteMentor,
        showMenteesModal,
        handleMenteesModal,
        mentees
       } 
    }
}
</script>

<template>
    <div :class="styles.adminPage_container">
        <Toast />

        <!-- Side Bar -->

        <div :class="styles.adminPage_sidebar">

            <!-- Home, Add, Report tabs -->

            <div :class="styles.adminPage_sidebar_first_half">
                <div 
                    :class="sideBarSelected === 'home' ? styles.adminPage_sidebar_icon_focus_container : styles.adminPage_sidebar_icon_container"
                    @click="sideBarSelected = 'home'"
                >
                    <i class="pi pi-home"></i>
                </div>
                <div 
                    :class="sideBarSelected === 'addressBook' ? styles.adminPage_sidebar_icon_focus_container : styles.adminPage_sidebar_icon_container"
                    @click="sideBarSelected = 'addressBook'"
                >
                    <i class="pi pi-address-book"></i>
                </div>
                <div 
                    :class="sideBarSelected === 'chartBar' ? styles.adminPage_sidebar_icon_focus_container : styles.adminPage_sidebar_icon_container"
                    @click="sideBarSelected = 'chartBar'"
                >
                    <i class="pi pi-chart-bar"></i>
                </div>
            </div>

            <!-- Profile, Logout -->

            <div :class="styles.adminPage_sidebar_second_half">
                <div 
                    :class="sideBarSelected === 'Profile' ? styles.adminPage_sidebar_icon_focus_container : styles.adminPage_sidebar_icon_container"
                    @click="sideBarSelected = 'Profile'"
                >
                    <i class="pi pi-user"></i>
                </div>
                <div 
                    :class="sideBarSelected === 'Logout' ? styles.adminPage_sidebar_icon_focus_container : styles.adminPage_sidebar_icon_container"
                    @click="handleLogout"
                >
                    <i class="pi pi-sign-out"></i>
                </div>
            </div>
        </div>

        <!-- Main Content -->

        <div :class="styles.adminPage_rest_container">

            <!-- Header -->

            <div :class="styles.adminPage_header">
                <h1>On-duty</h1>
                <div :class="styles.adminPage_header_search_container">
                    <AutoComplete v-model="value" 
                    :suggestions="items"
                    @complete="search" 
                    placeholder="Search by Roll Number/Mentor ID/Special Lab ID ...." />
                </div>
            </div>

            <!-- Page Content -->

            <div :class="styles.adminPage_content_container">

                <!-- Home Page -->

                <div v-if="sideBarSelected === 'home'">
                  <div :class="styles.adminPage_chart_container">
                    <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-30rem" />
                  </div>
                  <div :class="styles.adminPage_chart_first_values_container">
                    <h1>First Year:</h1>
                    <hr />
                    <h2>{{ firstYearCount }}</h2>
                  </div>
                  <div :class="styles.adminPage_chart_second_values_container">
                    <h1>Second Year:</h1>
                    <hr />
                    <h2>{{ secondYearCount }}</h2>
                  </div>
                  <div :class="styles.adminPage_chart_third_values_container">
                    <h1>Third Year:</h1>
                    <hr />
                    <h2>{{ thirdYearCount }}</h2>
                  </div>
                  <div :class="styles.adminPage_chart_final_values_container">
                    <h1>Final Year:</h1>
                    <hr />
                    <h2>{{ finalYearCount }}</h2>
                  </div>
                </div>

                <!-- User Details Page -->

                <div v-else-if="sideBarSelected === 'addressBook'">
                    <div :class="styles.adminPage_addUsers_whole">
                        <div :class="styles.adminPage_addUsers_container">
                            <div :class="styles.adminPage_addUsers_tabs_container">
                                <div 
                                    :class="addUserTab === 'students' ? styles.adminPage_addUsers_selected_tabs : styles.adminPage_addUsers_tabs"
                                    @click="addUserTab = 'students'"
                                >
                                    <h1>Students</h1>
                                </div>
                                <div 
                                    :class="addUserTab === 'mentors' ? styles.adminPage_addUsers_selected_tabs : styles.adminPage_addUsers_tabs"
                                    @click="addUserTab = 'mentors'"
                                >
                                    <h1>Mentors</h1>
                                </div>
                                <div 
                                    :class="addUserTab === 'pic' ? styles.adminPage_addUsers_selected_tabs : styles.adminPage_addUsers_tabs"
                                    @click="addUserTab = 'pic'"
                                >
                                    <h1>PIC</h1>
                                </div>
                            </div>

                            <div :class="styles.adminPage_addUsers_main_content">

                                <div v-if="addUserTab === 'students'">
                                    <div :class="styles.adminPage_addUsers_main_content_top">
                                        <div :class="styles.adminPage_addUsers_main_content_top_left"></div>
                                        <button @click="addBatchModel = !addBatchModel">
                                            <i class="pi pi-plus-circle"></i>
                                            Batch
                                        </button>
                                    </div>

                                    <div :class="styles.adminPage_addUsers_main_content_bottom">
                                        <Dialog
                                            v-model="addBatchModel"
                                            header="Add Batch"
                                            :visible="addBatchModel"
                                            @update:visible="addBatchModel = $event"
                                            :modal="true"
                                            :closable="true"
                                            :style="{ width: '40vw', height: '40vh' }"
                                        >
                                            <div :class="styles.adminPage_addUsers_batches_inside_modal">
                                                <form @submit.prevent="handleAddBatch">
                                                    <div :class="styles.input_group">
                                                        <input required type="text" name="batchName" autocomplete="off" :class="styles.input">
                                                        <label :class="styles.user_label">Batch Name: XXXX-XXXX</label>
                                                    </div>
                                                
                                                    <div :class="styles.adminPage_addUsers_batches_inside_modal_button_container">
                                                        <button 
                                                            type="submit"
                                                            :class="styles.adminPage_addUsers_batches_inside_modal_add_button"
                                                        >
                                                            Add
                                                        </button>
                                                
                                                        <button 
                                                            type="button"
                                                            :class="styles.adminPage_addUsers_batches_inside_modal_cancel_button"
                                                            @click="addBatchModel = false"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </Dialog>
                                        <div 
                                            :class="styles.adminPage_addUsers_batches_container"
                                            v-for="(batch, index) in batches.slice().reverse()"
                                            :key="index"
                                        >
                                            <div :class="styles.adminPage_addUsers_batches_year_container">
                                                <h1>{{ batch.name }}</h1>
                                            </div>
                                            <div :class="styles.adminPage_addUsers_batches_count_container">
                                                <h1>{{ batch.studentsCount }}</h1>
                                            </div>
                                            <div :class="styles.adminPage_addUsers_batches_enter_container">
                                                <button @click="handleNavigateToBatch(batch.name)">
                                                    <i class="pi pi-eye"></i>
                                                </button>
                                            </div>
                                            <div :class="styles.adminPage_addUsers_batches_delete_container">
                                                <button @click="handleDeleteBatch(batch.name)">
                                                    <i class="pi pi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-else-if="addUserTab === 'mentors'">
                                    <div :class="styles.adminPage_addUsers_main_content_top">
                                        <div :class="styles.adminPage_addUsers_main_content_top_left"></div>
                                        <button @click="addMentorModel = !addMentorModel">
                                            <i class="pi pi-plus-circle"></i>
                                            Mentors
                                        </button>
                                        <Dialog
                                            v-model="addMentorModel"
                                            header="Add Mentor"
                                            :visible="addMentorModel"
                                            @update:visible="addMentorModel = $event"
                                            :modal="true"
                                            :closable="true"
                                            :style="{ width: '70vw', height: '80vh' }"
                                        >
                                            <div :class="styles.adminPage_addUsers_mentor_modal_inside">
                                                <div :class="styles.adminPage_addUsers_mentor_modal_inside_tabs_container">
                                                    <div
                                                        :class="mentorTab === 'byMail' ? styles.adminPage_addUsers_mentor_modal_inside_selected_tabs : styles.adminPage_addUsers_mentor_modal_inside_tabs"
                                                        @click="mentorTab = 'byMail'"
                                                    >
                                                        <h1>By Mail</h1>
                                                    </div>
                                                    <div
                                                        :class="mentorTab === 'byCSV' ? styles.adminPage_addUsers_mentor_modal_inside_selected_tabs : styles.adminPage_addUsers_mentor_modal_inside_tabs"
                                                        @click="mentorTab = 'byCSV'"
                                                    >
                                                        <h1>By CSV</h1>
                                                    </div>
                                                </div>

                                                <div 
                                                    v-if="mentorTab === 'byMail'"
                                                    :class="styles.adminPage_addUsers_mentor_modal_inside_content"
                                                >
                                                    <form :class="styles.adminPage_addUsers_mentor_modal_inside_content_top">
                                                        <div :class="styles.input_group">
                                                            <input 
                                                                required
                                                                type="text"
                                                                name="mentorId" 
                                                                autocomplete="off" 
                                                                :class="styles.input"
                                                                @keyup.enter="handleAddMentorByMail"
                                                                v-model="mentor.mentorId"
                                                            >
                                                            <label :class="styles.user_label">Mentor ID</label>
                                                        </div>
                                                        <div :class="styles.input_group">
                                                            <input 
                                                                required
                                                                type="text"
                                                                name="mentorName" 
                                                                autocomplete="off" 
                                                                :class="styles.input"
                                                                @keyup.enter="handleAddMentorByMail"
                                                                v-model="mentor.mentorName"
                                                            >
                                                            <label :class="styles.user_label">Mentor Name</label>
                                                        </div>
                                                        <div :class="styles.input_group">
                                                            <input 
                                                                required
                                                                type="text"
                                                                name="mentorMail" 
                                                                autocomplete="off" 
                                                                :class="styles.input"
                                                                @keyup.enter="handleAddMentorByMail"
                                                                v-model="mentor.mentorEmail"
                                                            >
                                                            <label :class="styles.user_label">Mentor Mail</label>
                                                        </div>
                                                    </form>
                                                    
                                                    <div :class="styles.adminPage_addUsers_mentor_modal_inside_content_bottom">
                                                        <div 
                                                            :class="styles.adminPage_addUsers_mentor_modal_inside_mentor_container"
                                                            v-for="(mentor, index) in mentors"
                                                            :key="index"
                                                        >
                                                            <div :class="styles.adminPage_addUsers_mentor_index_container">
                                                                <h1>{{ index + 1 }}</h1>
                                                            </div>
                                                            <div :class="styles.adminPage_addUsers_mentor_id_container">
                                                                <h1>{{ mentor.mentorId }}</h1>
                                                            </div>
                                                            <div :class="styles.adminPage_addUsers_mentor_name_container">
                                                                <h1>{{ mentor.mentorName }}</h1>
                                                            </div>
                                                            <div :class="styles.adminPage_addUsers_mentor_email_container">
                                                                <h1>{{ mentor.mentorEmail }}</h1>
                                                            </div>
                                                            <div :class="styles.adminPage_addUsers_mentor_delete_container">
                                                                <i 
                                                                    class="pi pi-trash"
                                                                    @click="handleDeleteMentor(mentor.mentorId)"
                                                                ></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div 
                                                    :class="styles.adminPage_addUsers_mentor_modal_inside_content"
                                                    v-else-if="mentorTab === 'byCSV'"
                                                >
                                                    <div :class="styles.adminPage_addUsers_mentor_CSV_top">
                                                        <button @click="downloadMentorCSV">Download Template CSV</button>
                                                    </div>
                                                    <div :class="styles.adminPage_addUsers_mentor_CSV_main">
                                                        <div :class="styles.adminPage_addUsers_mentor_CSV_main_form">
                                                            <div :class="styles.adminPage_addUsers_mentor_CSV_main_form_header">
                                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                                                    <g id="SVGRepo_iconCarrier">
                                                                    <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                                    </g>
                                                                </svg>
                                                                <p>{{ mentorFileName }}</p>
                                                            </div>
                                                            <label for="file" :class="styles.adminPage_addUsers_mentor_CSV_main_form_footer">
                                                                <svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                                                    <g id="SVGRepo_iconCarrier">
                                                                    <path d="M15.331 6H8.5v20h15V14.154h-8.169z"></path>
                                                                    <path d="M18.153 6h-.009v5.342H23.5v-.002z"></path>
                                                                    </g>
                                                                </svg>
                                                                <p>{{ mentorFileName }}</p>
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
                                                            <input id="file" :class="styles.file" type="file" accept=".csv" @change="handleMentorCSVUpload" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Dialog>
                                    </div>
                                    
                                    <div :class="styles.adminPage_addUsers_main_content_bottom">
                                        <div
                                            :class="styles.adminPage_mentor_display_container"
                                            v-for="(mentor, index) in mentors"
                                        >
                                            <div :class="styles.adminPage_mentor_display_container_index">
                                                <h1>{{ index + 1 }}</h1>
                                            </div>
                                            <div :class="styles.adminPage_mentor_display_container_id">
                                                <h1>{{ mentor.mentorId }}</h1>
                                            </div>
                                            <div :class="styles.adminPage_mentor_display_container_name">
                                                <h1>{{ mentor.mentorName }}</h1>
                                            </div>
                                            <div :class="styles.adminPage_mentor_display_container_students">
                                                <button @click="handleMenteesModal(mentor.mentorId)">Students</button>
                                            </div>
                                            <div :class="styles.adminPage_mentor_display_container_delete">
                                                <i 
                                                    class="pi pi-trash"
                                                    @click="handleDeleteMentor(mentor.mentorId)"
                                                ></i>
                                            </div>

                                            <Dialog
                                                v-model="showMenteesModal"
                                                header = "Mentees"
                                                :visible="showMenteesModal"
                                                @update:visible="showMenteesModal = $event"
                                                :modal="true"
                                                :closable="true"
                                                style="width: 65vw; height: 80vh"
                                            >
                                                <div :class="styles.adminPage_mentor_inside_students_modal">
                                                    <div :class="styles.adminPage_mentor_inside_students_search_container">Search Filter goes here</div>
                                                    <div 
                                                        :class="styles.adminPage_mentor_inside_student_details_container"
                                                        v-for="(mentee, index) in mentees"
                                                        :key="index"
                                                    >
                                                        <div :class="styles.adminPage_mentor_inside_student_details_index">
                                                            <h1>{{ index + 1 }}</h1>
                                                        </div>
                                                        <div :class="styles.adminPage_mentor_inside_student_details_id">
                                                            <h1>{{ mentee.studentId }}</h1>
                                                        </div>
                                                        <div :class="styles.adminPage_mentor_inside_student_details_name">
                                                            <h1>{{ mentee.studentName }}</h1>
                                                        </div>
                                                        <div :class="styles.adminPage_mentor_inside_student_details_edit">
                                                            <i class="pi pi-pencil"></i>
                                                        </div>
                                                        <div :class="styles.adminPage_mentor_inside_student_details_delete">
                                                            <i class="pi pi-trash"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Dialog>
                                        </div>
                                    </div>
                                </div>

                                <div v-else-if="addUserTab === 'pic'">
                                    <div :class="styles.adminPage_addUsers_main_content_top">
                                        <button>
                                            <i class="pi pi-plus-circle"></i>
                                            PIC
                                        </button>
                                    </div>
                                    
                                    <div :class="styles.adminPage_addUsers_main_content_bottom"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>