<template>
  <div>
    <h2>Engagement overview</h2>
    <table data-type="engagement">
      <thead>
        <tr>
          <th>{{ staffLabel }}</th>
          <th v-for="mark in timeMarks.marks" :key="mark">
            {{ mark | formatDate }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(person, rowIndex) in engagementPerPerson"
          :key="person.id + '_' + rowIndex"
          :data-staff="person.id"
        >
          <th>{{ person.name }}</th>
          <td
            v-for="(engagement, i) in person.engagements"
            :key="i"
            :class="{ overloaded: engagement > 100 }"
          >
            {{ engagement }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "EngagementOverview",
  props: {
    tasksPerPerson: {
      type: Array
    },
    timeMarks: {
      type: Object
    },
    staffLabel: {
      type: String,
      required: true
    }
  },

  computed: {
    engagementPerPerson() {
      return this.tasksPerPerson.map(person => {
        return {
          name: person.name,
          engagements: this.timeMarks.marks.map(timestamp => {
            return person.tasks.filter(Boolean).reduce((sum, task) => {
              if (task === null) return sum;
              const start = task.start.getTime();
              const end = task.end.getTime();

              if (start <= timestamp && timestamp <= end)
                return sum + task.engagement;
              return sum;
            }, 0);
          })
        };
      });
    }
  },
  filters: {
    formatDate(date) {
      if (typeof date === "number") date = new Date(date);
      return [date.getDate(), date.getMonth() + 1]
        .map(nr => (nr > 9 ? nr : "0" + nr))
        .join("/");
    }
  }
};
</script>

<style>
table[data-type="engagement"] td {
  text-align: center;
}
table[data-type="engagement"] td.overloaded {
  color: lightcoral;
}
</style>
