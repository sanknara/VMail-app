<template>
  <div class="bulk-action-bar">
    <span class="checkbox">
      <input
        type="checkbox"
        :checked="allEmailsSelected"
        :class="[someEmailsSelected ? 'partial-check' : '']"
        @click="bulkSelect"
      />
    </span>
    <span class="buttons">
      <button
        @click="emailSelection.markRead()"
        :disabled="[...emailSelection.emails].every((e) => e.read)"
      >
        Mark Read
      </button>
      <button
        @click="emailSelection.markUnread()"
        :disabled="[...emailSelection.emails].every((e) => !e.read)"
      >
        Mark Unread
      </button>
      <button
        v-if="selectedScreen == 'inbox'"
        @click="emailSelection.archive()"
        :disabled="numberSelected === 0"
      >
        Archive
      </button>
      <button
        v-if="selectedScreen == 'archive'"
        @click="emailSelection.undoArchive()"
        :disabled="numberSelected === 0"
      >
        Undo Archive
      </button>
    </span>
  </div>
</template>
<script>
import useEmailSelection from "@/composables/use-email-selection";
import { computed } from "vue";
export default {
  setup(props) {
    let emailSelection = useEmailSelection();

    let numberSelected = computed(() => emailSelection.emails.size);
    let numberEmails = computed(() => props.emails.length);
    let allEmailsSelected = computed(() =>
      numberEmails.value ? numberSelected.value === numberEmails.value : false
    );
    let someEmailsSelected = computed(
      () =>
        numberSelected.value > 0 && numberSelected.value < numberEmails.value
    );
    let bulkSelect = function () {
      if (allEmailsSelected.value) {
        emailSelection.clear();
      } else {
        emailSelection.addMultiple(props.emails);
      }
    };
    return {
      allEmailsSelected,
      someEmailsSelected,
      bulkSelect,
      emailSelection,
      numberSelected,
    };
  },
  props: {
    emails: {
      type: Array,
      required: true,
    },
    selectedScreen: {
      type: String,
      required: true,
    },
  },
};
</script>