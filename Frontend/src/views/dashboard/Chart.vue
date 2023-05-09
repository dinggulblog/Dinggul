<template>
  <div class="chart">
    <div class="wrap_count">
      <div class="wrap_visit_count">
        <h2>총 방문자</h2>
        <span>{{ randomNumber1 }}명</span>
      </div>
      <div class="wrap_view_count">
        <h2>총 조회수</h2>
        <span>{{ randomNumber2 }}회</span>
      </div>
      <div class="wrap_post_count">
        <h2>총 포스팅</h2>
        <span>{{ randomNumber3 }}개</span>
      </div>
      <div class="wrap_day_count">
        <h2>블로그 운영</h2>
        <span>{{ randomNumber4 }}일 째</span>
      </div>
    </div>

    <div class="wrap_chart" style="display: flex;">
      <div class="wrap_visit_chart" style="width:50%;">
      <h2>연간 사이트 방문</h2>
      <div class="visit_chart">
        <canvas ref="CHART1_EL"></canvas>
      </div>
    </div>

    <div class="wrap_views_chart" style="width:50%;">
      <h2>연간 페이지 뷰</h2>
      <div class="views_chart">
        <canvas ref="CHART2_EL"></canvas>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Chart } from 'chart.js/auto'

const CHART1_EL = ref(null)
const CHART2_EL = ref(null)
const colors1 = ['#36a2eb', '#ff6384', '#4bc0c0', '#ff9f40', '#9966ff', '#ffcd56']
const colors2 = ['#36a2eb', '#ff6384', '#4bc0c0', '#ff9f40', '#9966ff', '#ffcd56']

const data = []
const randomNumber1 = ref(Math.floor(Math.random() * 10000) + 1)
const randomNumber2 = ref(Math.floor(Math.random() * 10000) + 1)
const randomNumber3 = ref(Math.floor(Math.random() * 10000) + 1)
const randomNumber4 = ref(Math.floor(Math.random() * 1000) + 1)

let prev = 100
for (let i = 0; i < 12; i++) {
  prev += 5 - Math.random() * 10
  data.push({ x: i, y: prev })
}

const creatChart = () => {
  new Chart(CHART1_EL.value, {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          data: data,
          lineTension: 0.4,
          borderColor: 'rgba(0, 0, 0, 0.1)',
          pointBorderColor: colors2,
          pointBackgroundColor: colors2,
          backgroundColor: 'rgba(0, 0, 0, 0.07)',
          borderWidth: 1,
          fill: true,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: {},
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  })

  new Chart(CHART2_EL.value, {
    type: 'bar',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          data: [2, 8, 12, 30, 5, 15, 10, 32, 55, 8, 22, 4],
          borderWidth: 0.1,
          backgroundColor: colors2,
          borderRadius: 9999,
          barPercentage: 0.25,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  })
}

const shuffle = (colors1, colors2) => {
  colors1.sort(() => Math.random() - 0.5)
  colors2.sort(() => Math.random() - 0.5)
}

onMounted(() => {
  shuffle(colors1, colors2)
  creatChart()
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.chart {
  .wrap_count {
    @include flex;

    & > div {
      @include flex(column, $jc: center, $ai: center);
      width: 100%;
      height: 9.6rem;
      margin: 0 0.8rem 0 0;
      border-radius: 1.6rem;

      &:last-child {
        margin: 0;
      }

      &:nth-child(1) {
        background: #ffeedf;
        h2 {
          color: #fda640;
        }
      }

      &:nth-child(2) {
        background: #e3ffdc;
        h2 {
          color: #48c669;
        }
      }

      &:nth-child(3) {
        background: #dafeff;
        h2 {
          color: #4bc0c0;
        }
      }

      &:nth-child(4) {
        background: #ffebf2;
        h2 {
          color: #ff6384;
        }
      }

      h2 {
        margin: 0 0 0.4rem;
        font-size: 1.6rem;
      }

      span {
        font-size: 1.4rem;
        letter-spacing: 0.1rem;
      }
    }
  }

  .wrap_visit_chart,
  .wrap_views_chart {
    margin: 6.4rem 0 0;

    h2 {
      font-size: 2rem;
      color: var(--text4);
      margin: 0 0 2.4rem;
    }
  }
}
</style>
