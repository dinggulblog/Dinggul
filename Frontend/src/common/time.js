import { ref } from 'vue'

export const formatTime = (time) => {
  return time
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timeZone: 'Asia/Seoul',
    })
    .slice(0, -1)
}

export const getTime = (createdAt) => {
  const createTime = new Date(createdAt).getTime()
  const curTime = new Date().getTime()            //  + 9 * 60 * 60 * 1000 한국 시간으로 계산 +9시간
  const calcTime = (curTime - createTime) / 1000  // getTime() ms 단위
  const RelativeTimeFormat = new Intl.RelativeTimeFormat('ko', { numeric: 'always' })
  const time = ref(null)

  // 60 = 1분
  if (calcTime < 60) {
    time.value = '방금 전'
  } else if (calcTime < 60 * 60) {
    time.value = RelativeTimeFormat.format(-Math.floor(calcTime / 60), 'minute')
  } else if (calcTime < 60 * 60 * 24) {
    time.value = RelativeTimeFormat.format(-Math.floor(calcTime / (60 * 60)), 'hour')
  } else if (calcTime < 60 * 60 * 24 * 30) {
    time.value = RelativeTimeFormat.format(-Math.floor(calcTime / (60 * 60 * 24)), 'day')
  } else {
    time.value = formatTime(new Date(createdAt))
  }

  return time.value
}
