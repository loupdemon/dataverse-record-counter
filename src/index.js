import "regenerator-runtime/runtime";
import getEntityPluralName from "./api/get-entity-plural-name";
import getTotalRecordCountWithFetch from "./api/get-total-record-count/with-fetch";

export default async function getTotalRecordCount(context) {
  const fetchXml = context.getFetchXml();
  const logicalName = context.getEntityName();
  const [recordCount, entityPluralName] = await Promise.all([
    getTotalRecordCountWithFetch(logicalName, fetchXml),
    getEntityPluralName(logicalName),
  ]);
  Xrm.Navigation.openAlertDialog({
    title: "Total Record Count",
    text: `${recordCount.toLocaleString()} ${entityPluralName}`,
  });
}
