<script lang="ts">
// Dependencies

import { ref, onMounted } from "vue";

// Components

// Styles

import styles from './adminPage.module.css';

// Assets

// Interfaces

//Functions and variables

const value = ref<string>("");
const items = ref<string[]>([]);
const sideBarSelected = ref<string>('home');

const search = (event : {query: string}) => {
    items.value = [...Array(10).keys()].map((item) => event.query + '-' + item);
}

export default {
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
      chartData,
      chartOptions,
      sideBarSelected,
      styles,
      value,
      items,
      search,
      firstYearCount,
      secondYearCount,
      thirdYearCount,
      finalYearCount,
    };
  },
};

// export default {
//   data() {
//     return {
//       sideBarSelected: 'home',
//       styles,
//       value,
//       items,
//       search,
//       chartData,
//       chartOptions,
//     }
// }};
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
                    @click="sideBarSelected = 'Logout'"
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
            </div>
        </div>
    </div>
</template>