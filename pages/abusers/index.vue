<template>
  <v-layout column>
    <v-flex>
      <v-toolbar prominent
                 flat
                 extended
                 color="white">

        <v-flex xs12 sm6 md4>
          <v-menu
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="date"
              ref="menu"
              v-model="menu"
              transition="scale-transition"
              offset-y
              min-width="260"
          >
            <v-text-field
                slot="activator"
                v-model="date"
                label="Picker in menu"
                prepend-icon="event"
                type="month"
                readonly
            ></v-text-field>
            <v-date-picker v-model="date"
                           type="month"
                           reactive>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-flex>

        <v-btn color="primary"
               dark
               @click="loadReport"
               class="mb-2">Show report
        </v-btn>
        <v-spacer/>
        <v-btn color="primary"
               dark
               @click="generateData"
               class="mb-2">Generate data
        </v-btn>
      </v-toolbar>
    </v-flex>
    <v-flex>
      <h1>Report for {{ reportDate }}</h1>
    </v-flex>
    <v-flex>
      <v-data-table
          :headers="headers"
          :items="items"
          :loading="tableLoader"
          class="elevation-5">
        <v-progress-linear slot="progress"
                           color="blue"
                           indeterminate/>
        <template slot="items"
                  slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td>{{ formatSize(props.item.total_bytes) }}</td>
          <td>{{ formatSize(props.item.quota_bytes) }}</td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>

</template>

<script>
  import moment from 'moment'
  import axios from 'axios'
  import { formatSize } from '~/utils'

  const TABLE_HEADERS = [
    { text: 'Company', value: 'name' },
    { text: 'Total', value: 'total_bytes' },
    { text: 'Quota', value: 'quota_bytes' }
  ]

  export default {
    name: 'index',
    data () {
      return {
        date: moment().format('YYYY-MM'),
        reportDate: null,
        menu: false,
        headers: TABLE_HEADERS,
        tableLoader: true,
        items: []
      }
    },

    created () {
      this.reportDate = this.formatDate(this.date)
      this.loadReport()
    },

    methods: {
      loadReport () {
        this.tableLoader = true
        this.items = []

        const year = moment(this.date).year()
        const month = moment(this.date).month() + 1

        this.reportDate = this.formatDate(this.date)

        axios.post(`/api/report`, {
          year: year,
          month: month
        })
          .then(({ data }) => {
            this.items = data
            this.tableLoader = false
          })
      },

      generateData () {
        this.tableLoader = true
        this.items = []
        axios.post(`/api/generate`)
          .then(() => {
            this.loadReport()
          })
      },

      formatSize (bytes) {
        return formatSize(bytes)
      },

      formatDate (date) {
        return moment(date).format('MMMM YYYY')
      }
    }
  }
</script>

<style scoped>

</style>
