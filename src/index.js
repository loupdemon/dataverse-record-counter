import "regenerator-runtime/runtime";
import getTotalRecordCount from "./get-total-record-count";
import createAbcFilter from "./create-abc-filter";

(async () => {
  console.log(
    await getTotalRecordCount("contact", `?$filter=${createAbcFilter(13)}`)
  );
})();

/*
"<fetch>" +
  "<entity name='contact'>" +
    "<attribute name='contactid' />" +
  "</entity>" +
"</fetch>"
*/
