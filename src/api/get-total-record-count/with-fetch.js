//import { json2xml, xml2json } from "xml-js";
import XmlCore, { XmlNodeType } from "xml-core";
import getApiResult from "../get-api-result";
import getEntitySetName from "../get-entity-set-name";

export default async function getTotalRecordCountWithFetch(entityName, fetch) {
  const entitySetName = await getEntitySetName(entityName);

  const fetchDocument = XmlCore.Parse(fetch);
  const fetchNode = fetchDocument.firstElementChild;
  fetchNode.setAttribute("count", "5000");
  fetchNode.setAttribute("page", "1");

  const entityNode = fetchNode.firstElementChild;
  entityNode.childNodes.forEach((element) => {
    if (
      element.nodeType !== XmlNodeType.Element ||
      (element.nodeName === "attribute" &&
        element.getAttribute("name") !== `${entityName}id`) ||
      element.nodeName === "all-attributes" ||
      element.nodeName === "order"
    ) {
      element.remove();
    }
  });

  /*const fetchObject = JSON.parse(
    xml2json(fetch, {
      compact: false,
    })
  );
  const fetchNode = fetchObject.elements[0];
  fetchNode.attributes.count = "5000";
  if (!fetchNode.attributes.page) {
    fetchNode.attributes.page = "1";
  }
  const entityNode = fetchNode.elements[0];
  entityNode.elements = entityNode.elements.filter(
    (element) =>
      !(
        element.name === "attribute" &&
        element.attributes.name !== `${entityName}id`
      ) &&
      element.name !== "order" &&
      element.name !== "all-attributes"
  );*/

  let totalEntitiesCount = 0;
  let moreRecords = true;
  while (moreRecords) {
    const fetchXml = fetchDocument.toString();
    console.log(fetchXml);
    const result = await getApiResult(entitySetName, {
      fetchXml: fetchXml,
    });
    const fetchXmlPagingCookie =
      result["@Microsoft.Dynamics.CRM.fetchxmlpagingcookie"];
    if (fetchXmlPagingCookie) {
      const fetchXmlPagingCookieObject = JSON.parse(
        xml2json(fetchXmlPagingCookie)
      );
      const encodedPagingCookie =
        fetchXmlPagingCookieObject.elements[0].attributes.pagingcookie;
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
