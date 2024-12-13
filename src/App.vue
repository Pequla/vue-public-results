<script lang="ts" setup>
import { ref } from 'vue';
import { SubjectModel } from './models/student.model';
import { ResultModel } from './models/result.model';
import axios from 'axios';

const search = ref<string>('')
const subject = ref<SubjectModel>()
const results = ref<ResultModel[]>()

const urlParams = new URLSearchParams(window.location.search);
const permalink = urlParams.get('subject');

function goToHomePage() {
  window.location.href = 'https://singidunum.ac.rs/'
}

if (permalink == null || permalink == '')
  goToHomePage()

const client = axios.create({
  baseURL: 'https://results.singidunum.ac.rs/api',
  headers: {
    'Accept': 'application/json'
  },
  validateStatus: (status) => {
    return status === 200 || status === 204
  }
})

client.get(`/subject/permalink/${permalink}`)
  .then(rsp => subject.value = rsp.data)
  .catch(e => {
    console.error(e)
    goToHomePage()
  })

function getTotalPoints(result: ResultModel) {
  const total = (result.firstMidterm ?? 0) + (result.secondMidterm ?? 0) + (result.finalExam ?? 0) + (result.attendanceLectures ?? 0) + (result.attendanceExcercises ?? 0)
  return (() => {
    switch (true) {
      case total <= 50:
        return {
          value: 5,
          points: total,
          style: 'fw-bold text-danger'
        };
      case total <= 60:
        return {
          value: 6,
          points: total,
          style: 'fw-bold text-success'
        };
      case total <= 70:
        return {
          value: 7,
          points: total,
          style: 'fw-bold text-success'
        };
      case total <= 80:
        return {
          value: 8,
          points: total,
          style: 'fw-bold text-success'
        };
      case total <= 90:
        return {
          value: 9,
          points: total,
          style: 'fw-bold text-success'
        };
      case total <= 100:
        return {
          value: 10,
          points: total,
          style: 'fw-bold text-success'
        };
      default:
        return {
          value: 10,
          points: total,
          style: 'fw-bold text-success'
        };
    }
  })();
}

function loadResults() {
  client.get(`/result/subject/permalink/${permalink}?search=${search.value}`)
    .then(rsp => {
      for (let r of rsp.data) {
        r.mark = getTotalPoints(r)
      }
      results.value = rsp.data
    })
}

loadResults()
</script>

<template>
  <div class="container" v-if="subject">
    <div class="text-center mt-3 mb-3">
      <img src="/logo.png" alt="Univerzitet Singidunum" width="300">
      <h3>{{ subject.name }}</h3>
      <div class="mb-3 search-box mx-auto hide-on-print">
        <input type="text" class="form-control form-control-sm"
          :placeholder="subject.lang == 'en' ? '🔍 Search' : '🔍 Pretraga'" v-model="search" @keyup="loadResults">
      </div>
      <table class="table table-striped mt-3 mb-3" v-if="results && results.length > 0">
        <thead>
          <tr>
            <th scope="col">{{ subject.lang == "en" ? "Student" : "Student" }}</th>
            <th scope="col">{{ subject.lang == "en" ? "1st Midterm" : "I Kolokvijum" }}</th>
            <th scope="col">{{ subject.lang == "en" ? "2nd Midterm" : "II Kolokvijum" }}</th>
            <th scope="col">{{ subject.lang == "en" ? "Final Exam" : "Ispit" }}</th>
            <th scope="col">{{ subject.lang == "en" ? "Lectures" : "Predavanja" }}</th>
            <th scope="col">{{ subject.lang == "en" ? "Exercises" : "Vežbe" }}</th>
            <th scope="col">{{ subject.lang == "en" ? "Total" : "Ukupno" }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in results">
            <th scope="row">{{ item.student.index }}</th>
            <td>{{ item.firstMidterm ?? 'N/A' }}</td>
            <td>{{ item.secondMidterm ?? 'N/A' }}</td>
            <td>{{ item.finalExam ?? 'N/A' }}</td>
            <td>{{ item.attendanceLectures ?? 'N/A' }}</td>
            <td>{{ item.attendanceExcercises ?? 'N/A' }}</td>
            <td :class="item.mark.style">{{ item.mark.value }} ({{ item.mark.points }})</td>
          </tr>
        </tbody>
      </table>
      <div class="text-center" v-else-if="results && results.length == 0">
        {{ subject.lang == "en" ? "No results were found" : "Rezultati nisu pronađeni" }}
      </div>
      <div class="text-center" v-else>
        {{ subject.lang == "en" ? "Results are loading..." : "Rezultati se učitavaju..." }}
      </div>
    </div>
    <div class="text-center hide-on-print">&copy; {{ new Date().getFullYear() }} {{ subject.lang == "en" ? "Singidunum University" :
      "Univerzitet Singidunum" }}</div>
  </div>
</template>