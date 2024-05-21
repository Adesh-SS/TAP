<script lang="ts">
//dependencies

import { useRouter } from 'vue-router';
import { ref, onMounted } from "vue";

//style

import styles from './showReport.module.css';

//components

//interfaces

interface Type {
  label: string;
  value: string;
}

interface Category {
  label: string;
  code: string;
  items: Type[];
}

interface Dataset {
  label: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  data: number[];
}

interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

interface ChartOptions {
  indexAxis: string;
  maintainAspectRatio: boolean;
  aspectRatio: number;
  plugins: {
    legend: {
      labels: {
        color: string;
      };
    };
  };
  scales: {
    x: {
      ticks: {
        color: string;
        font: {
          weight: number;
        };
      };
      grid: {
        display: boolean;
        drawBorder: boolean;
      };
    };
    y: {
      ticks: {
        color: string;
      };
      grid: {
        color: string;
        drawBorder: boolean;
      };
    };
  };
}

//assets

//variables

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

const chartData = ref<ChartData | undefined>(undefined);
const chartOptions = ref<ChartOptions | undefined>(undefined);

//functions

const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const setChartData = (startDateString: string, endDateString: string, type: string): ChartData => {
  
  if (startDateString && endDateString) {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    const diffInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // Generate an array of dates between the start and end dates
    const labels = Array.from({length: diffInDays + 1}, (_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    });

    // Generate an array of student counts based on the type
    // Replace this with your actual data
    const data = Array.from({length: diffInDays + 1}, () => {
      return Math.floor(Math.random() * 100);
    });

    // Generate an array of colors for each bar
    const backgroundColors = Array.from({length: diffInDays + 1}, (_, i) => 'rgba(255, 99, 132)');
    const borderColors = Array.from({length: diffInDays + 1}, (_, i) => 'rgb(255, 99, 132)');

    return {
      labels: labels,
      datasets: [
        {
          label: 'Students',
          data: data,
          backgroundColor: backgroundColors as any, // array of color strings
          borderColor: borderColors as any, // array of color strings
          borderWidth: 1 as any
        }
      ]
    };
  }

  // Default return statement
  return {
    labels: [],
    datasets: []
  };
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
        indexAxis: 'x', // or 'y', depending on your chart
        maintainAspectRatio: false, // or true, depending on your needs
        aspectRatio: 1, // adjust this value as needed
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500, // adjust this value as needed
                    }
                },
                grid: {
                    color: surfaceBorder,
                    display: true, // or false, depending on your needs
                    drawBorder: true, // or false, depending on your needs
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: true, // or false, depending on your needs
                }
            }
        }
    };
};


const logInput = () => {
  if (buttondisplay.value && endDateDisplay.value) {
  chartData.value = setChartData(
    buttondisplay.value?.toISOString() ?? '',
    endDateDisplay.value?.toISOString() ?? '',
    selectedType.value ?? ''
  );
  } else {
    console.error('buttondisplay.value or endDateDisplay.value is null');
  }
};
//export

export default{
    setup(){
        const router = useRouter();

        const navigateBack = () => {
            router.go(-1);
        };

        onMounted(() => {
            chartData.value = setChartData(
              buttondisplay.value?.toISOString() ?? '',
              endDateDisplay.value?.toISOString() ?? '',
              selectedType.value ?? ''
            );
            chartOptions.value = setChartOptions();
        });

        return{
            styles,
            navigateBack,
            selectedType,
            groupedTypes,
            buttondisplay,
            endDateDisplay,
            chartData,
            chartOptions,
            setChartData,
            setChartOptions,
            logInput,
        };
    }
}
</script>

<template>
    <div :class="styles.report_container">

        <!-- Header -->

        <div :class="styles.report_header">
            <div :class="styles.report_header_left">
                <button @click="navigateBack">
                    <i class="pi pi-arrow-circle-left"></i>
                </button>
            </div>
            <div :class="styles.report_header_right">
                <button>
                    <i class="pi pi-download"></i>
                    Download
                </button>
            </div>
        </div>

        <!-- Body -->

        <div :class="styles.report_main_container">

            <!-- Report Filter -->

            <form :class="styles.report_options_container" @submit.prevent="logInput">
              <Dropdown v-model="selectedType" :options="groupedTypes" optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" placeholder="Event Type" class="w-full md:w-14rem">
                <template #optiongroup="slotProps">
                  <div class="flex align-items-center">
                    <div>{{ slotProps.option.label }}</div>
                  </div>
                </template>
              </Dropdown>
              <Calendar v-model="buttondisplay" showIcon :showOnFocus="false" inputId="buttondisplay" dateFormat="dd/mm/yy" placeholder="From Date - dd/mm/yyyy" />
              <Calendar v-model="endDateDisplay" showIcon :showOnFocus="false" inputId="enddisplay" dateFormat="dd/mm/yy" placeholder="To Date - dd/mm/yyyy" />
              <button type="submit" style="display: none;" />
            </form>

            <!-- Report Graph -->

            <div :class="styles.report_chart_container">
              <Chart type="bar" :data="chartData" :options="chartOptions" :width="800" :height="400" />
            </div>
        </div>
    </div>
</template>