import getApiResult from "./get-api-result";

export default async function getEntityPluralName(logicalName) {
  const entity = await getApiResult(
    `EntityDefinitions(LogicalName='${logicalName}')`,
    { $select: "DisplayCollectionName" }
  );
  return entity.DisplayCollectionName.UserLocalizedLabel.Label;
}
