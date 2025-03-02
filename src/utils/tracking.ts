type TrackingSource = {
  firstSource: string;
  isSharedFromBrowser: boolean;
};

const TRACKING_SOURCE = {
  urlParams: ["utm_source", "ref", "from", "source", "s"],
  firstSessionLocalStorageName: "kkqqppbbwwhhdd",
};

function getTrackingSourceFromUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);

  for (const param of TRACKING_SOURCE.urlParams) {
    const source = urlParams.get(param);

    if (source) {
      return source;
    }
  }
}

function getDomainFromUrl(url: string): string | undefined {
  return url.split("/")[2];
}

function getFirstTrackingSource(): TrackingSource | undefined {
  const rawFirstSource = localStorage.getItem(
    TRACKING_SOURCE.firstSessionLocalStorageName
  );
  return rawFirstSource
    ? (JSON.parse(rawFirstSource) as TrackingSource)
    : undefined;
}

function getTrackingSource(): TrackingSource {
  const firstSource = getFirstTrackingSource();
  const currentSource =
    getTrackingSourceFromUrlParams() || getDomainFromUrl(document.referrer);
  const isSharedFromBrowser = _isSharedFromBrowser();

  if (!firstSource && currentSource) {
    localStorage.setItem(
      TRACKING_SOURCE.firstSessionLocalStorageName,
      JSON.stringify({ firstSource: currentSource, isSharedFromBrowser })
    );
  }

  return {
    firstSource: firstSource?.firstSource || currentSource || "direct",
    isSharedFromBrowser:
      firstSource?.isSharedFromBrowser ?? isSharedFromBrowser,
  };
}

function _isSharedFromBrowser(): boolean {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has("sh");
}

function isOnMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function removeVowels(str: string): string {
  return str.replace(/[aeiou]/g, "");
}

export function getTrackingID(): string {
  const source = getTrackingSource();
  console.log("trk", source);
  const trackingID = btoa(removeVowels(source.firstSource));
  return `${trackingID}.${isOnMobile() ? "m" : "d"}${
    source.isSharedFromBrowser ? "s" : ""
  }`;
}

export function addCopyUrlSourceInUrl(): void {
  const urlParams = new URLSearchParams(window.location.search);
  const firstSource = getFirstTrackingSource()?.firstSource;
  urlParams.set("sh", "1");
  if (firstSource) {
    urlParams.set("s", removeVowels(firstSource));
  }
  window.history.replaceState(
    {},
    "",
    `${window.location.pathname}?${urlParams.toString()}`
  );
}
