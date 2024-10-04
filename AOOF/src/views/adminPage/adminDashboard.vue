<script lang="ts">
//Dependencies

import { ref, onMounted } from 'vue';
import axios from 'axios';

//Components

//Styles

import styles from './adminPage.module.css';

//Assets

//Interfaces

interface Batch {
    batchYear: string;
    batchCount: number;
}

//Variables

const sideBarSelected = ref<string>('addressBook');
const value = ref<string>("");
const items = ref<string[]>([]);
const addUserTab = ref<string>('students');
const batches = ref<Batch[]>([]);
const addBatchModel = ref<boolean>(false);

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
            }
        } catch (error) {
            console.log(error);
        }
    }
}

//Exports

export default{
    setup() {
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

        onMounted(() => {
        chartData.value = setChartData();
        chartOptions.value = setChartOptions();
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
        handleAddBatch
       } 
    }
}
</script>

<template>
    <div :class="styles.adminPage_container">

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
                                            v-for="(batch, index) in batches"
                                            :key="index"
                                        >
                                            <div :class="styles.adminPage_addUsers_batches_year_container">
                                                <h1>{{ batch.batchYear }}</h1>
                                            </div>
                                            <div :class="styles.adminPage_addUsers_batches_count_container">
                                                <h1>{{ batch.batchCount }}</h1>
                                            </div>
                                            <div :class="styles.adminPage_addUsers_batches_enter_container">
                                                <button>
                                                    <i class="pi pi-eye"></i>
                                                </button>
                                            </div>
                                            <div :class="styles.adminPage_addUsers_batches_delete_container">
                                                <button>
                                                    <i class="pi pi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-else-if="addUserTab === 'mentors'">
                                    <div :class="styles.adminPage_addUsers_main_content_top">
                                        <button>
                                            <i class="pi pi-plus-circle"></i>
                                            Mentors
                                        </button>
                                    </div>
                                    
                                    <div :class="styles.adminPage_addUsers_main_content_bottom"></div>
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