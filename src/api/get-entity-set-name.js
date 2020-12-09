import getApiResult from "./get-api-result";

export default async function getEntitySetName(logicalName) {
  const entitySets = getEntitySets();

  if (!entitySets.hasOwnProperty()) {
    const entity = await getApiResult(
      `EntityDefinitions(LogicalName='${logicalName}')`,
      { $select: "EntitySetName" }
    );
    const entitySetName = entity.EntitySetName;

    entitySets[logicalName] = entitySetName;

    localStorage.setItem("entitySets", JSON.stringify(entitySets));
  }

  return entitySets[logicalName];
}

function getEntitySets() {
  let json = localStorage.getItem("entitySets");
  if (json) {
    return JSON.parse(json);
  } else {
    return {};
  }
}
