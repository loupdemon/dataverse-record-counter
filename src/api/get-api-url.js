export default function getApiUrl() {
  const globalContext = Xrm.Utility.getGlobalContext();

  const clientUrl = new URL(globalContext.getClientUrl());
  const version = getVersion(globalContext);

  clientUrl.pathname = `api/data/v${version}/`;

  return clientUrl;
}

function getVersion(globalContext) {
  const fullVersion = globalContext.getVersion();
  const apiVersion = fullVersion.replace(
    new RegExp(/^([0-9]+\.[0-9]+)\..*/),
    "$1"
  );
  return apiVersion;
}
