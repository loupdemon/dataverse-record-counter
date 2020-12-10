import { Parse, XmlNodeType, Stringify } from "xml-core";
import getApiResult from "../get-api-result";
import getEntitySetName from "../get-entity-set-name";

export default async function getTotalRecordCountWithFetch(entityName, fetch) {
  const entitySetName = await getEntitySetName(entityName);

  const fetchDocument = Parse(fetch);
  const fetchNode = fetchDocument.firstElementChild;
  fetchNode.setAttribute("count", "5000");
  fetchNode.setAttribute("page", "1");

  const entityNode = fetchNode.firstElementChild;
  const childNodesToRemove = [];
  entityNode.childNodes.forEach((childNode) => {
    if (
      childNode.nodeType !== XmlNodeType.Element ||
      (childNode.nodeName === "attribute" &&
        childNode.getAttribute("name") !== `${entityName}id`) ||
      childNode.nodeName === "all-attributes" ||
      childNode.nodeName === "order"
    ) {
      childNodesToRemove.push(childNode);
    }
  });
  childNodesToRemove.forEach((childNode) => entityNode.removeChild(childNode));

  let totalEntitiesCount = 0;
  let moreRecords = true;
  while (moreRecords) {
    const fetchXml = Stringify(fetchDocument);
    const result = await getApiResult(entitySetName, {
      fetchXml: fetchXml,
    });
    const fetchXmlPagingCookie =
      result["@Microsoft.Dynamics.CRM.fetchxmlpagingcookie"];
    if (fetchXmlPagingCookie) {
      const fetchXmlPagingCookieObject = Parse(fetchXmlPagingCookie);
      const encodedPagingCookie = fetchXmlPagingCookieObject.firstElementChild.getAttribute(
        "pagingcookie"
      );
      const pagingCookieXml = decodeURIComponent(
        decodeURIComponent(encodedPagingCookie)
      );
      fetchNode.attributes["paging-cookie"] = pagingCookieXml;
      fetchNode.attributes["page"] = parseInt(fetchNode.attributes["page"]) + 1;
    } else {
      moreRecords = false;
    }
    totalEntitiesCount += result.value.length;
  }
  return totalEntitiesCount;
}
