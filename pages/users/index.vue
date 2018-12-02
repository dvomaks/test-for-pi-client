<template>
  <v-layout>
    <v-flex>
      <v-toolbar color="white">
        <v-toolbar-title>User CRUD</v-toolbar-title>
        <v-spacer/>
        <v-dialog v-model="formDialog"
                  max-width="360"
                  hide-overlay
                  transition="dialog-bottom-transition">
          <v-btn slot="activator"
                 color="primary"
                 dark
                 class="mb-2">Add
          </v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field v-model="editedItem.name"
                                  label="Name"/>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field v-model="editedItem.email"
                                  label="Email"/>
                  </v-flex>
                  <v-flex xs12>
                    <v-select v-model="editedItem.company_id"
                              :items="companies"
                              :return-object="false"
                              item-value="id"
                              item-text="name"
                              label="Company">
                    </v-select>

                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer/>
              <v-btn color="blue darken-1"
                     flat
                     @click="close">Cancel
              </v-btn>
              <v-btn color="blue darken-1"
                     flat
                     @click="save">Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
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
          <td>{{ props.item.email }}</td>
          <td>{{ props.item.company.name }}</td>
          <td class="justify-center layout px-0">
            <v-icon small
                    class="mr-2"
                    @click="editItem(props.item)">
              edit
            </v-icon>
            <v-icon small
                    @click="deleteItem(props.item)">
              delete
            </v-icon>
          </td>
        </template>
      </v-data-table>
    </v-flex>

  </v-layout>


</template>

<script>
  import axios from 'axios'

  const ENTITY = 'user'

  const DEFAULT_ITEM = {
    name: null,
    email: null,
    company_id: null
  }

  const TABLE_HEADERS = [
    { text: 'Name', value: 'name' },
    { text: 'Email', value: 'email' },
    { text: 'Company', value: 'company.name' },
    { text: 'Actions', value: 'name', sortable: false }
  ]

  export default {
    name: 'index',
    data () {
      return {

        entity: ENTITY,

        alert: true,

        // Form dialog
        formDialog: false,
        editedIndex: -1,
        editedItem: Object.assign({}, DEFAULT_ITEM),
        defaultItem: Object.assign({}, DEFAULT_ITEM),

        // Table
        tableLoader: true,
        headers: TABLE_HEADERS,
        items: [],

        companies: []
      }
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New' : 'Edit'
      }
    },
    watch: {
      formDialog (val) {
        val || this.close()
      }
    },
    created () {
      axios.all([
        axios.get(`api/${this.entity}`),
        axios.get(`api/company`)
      ])
        .then(axios.spread((items, companies) => {
          this.items = items.data
          this.companies = companies.data
          this.tableLoader = false
        }))
    },
    methods: {

      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.formDialog = true
      },

      deleteItem (item) {
        const index = this.items.indexOf(item)
        const del = confirm('Are you sure you want to delete this item?')
        if (del) {
          this.tableLoader = true
          axios.delete(`api/${this.entity}/${item.id}`)
            .then(() => {
              this.items.splice(index, 1)
              this.tableLoader = false
            })
        }
      },

      close () {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.formDialog = false
      },

      save () {
        this.tableLoader = true
        if (this.editedIndex > -1) {
          let item = this.items[this.editedIndex]
          axios.put(`api/${this.entity}/${item.id}`, this.editedItem)
            .then((res) => {
              Object.assign(item, res.data)
              this.tableLoader = false
            })
            .catch(err => {
              console.log(err)
              if (err.response.status === 422) {
                this.showFormErrors(err.response.data.errors)
              }
              this.tableLoader = false
            })
        } else {
          axios.post(`api/${this.entity}`, this.editedItem)
            .then(({ data }) => {
              this.items.push(data)
              this.tableLoader = false
            })
            .catch(err => {
              console.log(err.response)
              if (err.response.status === 422) {
                this.showFormErrors(err.response.data.errors)
              }
              this.tableLoader = false
            })
        }
        this.close()
      },

      showFormErrors (errors) {
        for (let key in errors) {
          this.$toast.error(errors[key][0])
        }
      }
    }
  }
</script>

<style scoped>

</style>
