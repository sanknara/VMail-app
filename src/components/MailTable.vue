<template>
  <button @click="selectScreen('inbox')" :disabled="selectedScreen == 'inbox'">
    Inbox
  </button>
  <button
    @click="selectScreen('archive')"
    :disabled="selectedScreen == 'archive'"
  >
    Archived
  </button>
  <BulkActionBar
    :emails="filteredEmails"
    :selectedScreen="selectedScreen"
  ></BulkActionBar>
  <table class="mail-table">
    <tbody>
      <tr
        v-for="email in filteredEmails"
        :key="email.id"
        :class="[email.read ? 'read' : '', 'clickable']"
      >
        <td>
          <input
            type="checkbox"
            @click="emailSelection.toggle(email)"
            :checked="emailSelection.emails.has(email)"
          />
        </td>
        <td @click="openEmail(email)">{{ email.from }}</td>
        <td @click="openEmail(email)">
          <p>
            <strong>{{ email.subject }}</strong> - {{ email.body }}
          </p>
        </td>
        <td class="date" @click="openEmail(email)">
          {{ format(new Date(email.sentAt), "MMM do yyyy") }}
        </td>
        <td>
          <button v-if="selectedScreen == 'inbox'" @click="archiveEmail(email)">
            Archive
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <ModalView v-if="openedEmail" @close-modal="openedEmail = null">
    <MailView :email="openedEmail" @change-email="changeEmail" />
  </ModalView>
</template>
<script>
import { format } from "date-fns";
import axios from "axios";
import MailView from "@/components/MailView.vue";
import ModalView from "@/components/ModalView.vue";
import { ref } from "vue";
import useEmailSelection from "../composables/use-email-selection";
import BulkActionBar from "./BulkActionBar";
export default {
  async setup() {
    let { data: emails } = await axios.get("/emails");

    return {
      emailSelection: useEmailSelection(),
      format,
      emails: ref(emails),
      openedEmail: ref(null),
      selectedScreen: ref("inbox"),
    };
  },
  components: {
    MailView,
    ModalView,
    BulkActionBar,
  },
  computed: {
    sortedEmails() {
      return this.emails.slice().sort((e1, e2) => {
        return e1.sentAt < e2.sentAt ? 1 : -1;
      });
    },
    filteredEmails() {
      if (this.selectedScreen == "inbox") {
        return this.sortedEmails.filter((e) => !e.archived);
      } else {
        return this.sortedEmails.filter((e) => e.archived);
      }
    },
  },
  methods: {
    selectScreen(newScreen) {
      this.selectedScreen = newScreen;
      this.emailSelection.clear();
      console.log(this.selectedScreen);
    },
    openEmail(email) {
      this.openedEmail = email;
      if (email) {
        email.read = true;
        this.updateEmail(email);
      }
    },
    archiveEmail(email) {
      email.archived = true;
      this.updateEmail(email);
    },
    updateEmail(email) {
      axios.put(`/emails/${email.id}`, email);
    },
    changeEmail({ toggleRead, toggleArchive, save, closeModal, changeIndex }) {
      let email = this.openedEmail;
      if (toggleRead) {
        email.read = !email.read;
      }
      if (toggleArchive) {
        email.archived = !email.archived;
      }
      if (save) {
        this.updateEmail(email);
      }
      if (closeModal) {
        this.openedEmail = null;
      }
      if (changeIndex) {
        let emails = this.filteredEmails;
        let currentIndex = emails.indexOf(this.openedEmail);
        let newEmail = emails[currentIndex + changeIndex];
        this.openEmail(newEmail);
      }
    },
  },
};
</script>
<style scoped>
</style>