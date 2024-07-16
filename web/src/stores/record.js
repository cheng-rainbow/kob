import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";

export const useRecordStore = defineStore("useRecordStore", () => {
  const record = reactive({
    is_record: false,
    a_steps: "",
    b_steps: "",
    record_loser: "",
  });
  const updateIsRecod = (is_record) => {
    record.is_record = is_record;
  };

  const updateSteps = (data) => {
    record.a_steps = data.a_steps;
    record.b_steps = data.b_steps;
  };

  const updateRecordLoser = (loesr) => {
    record.record_loser = loesr;
  };
  return { record, updateIsRecod, updateSteps, updateRecordLoser };
});
