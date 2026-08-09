async function testFetch() {
    const url = "https://map-auea.ramm.com/v2/mapping/settingdata/296/dc7b8b7b-4273-485a-94a7-4fd02723f982/?format=geojson&forcePoint=false";
    
    const endpoints = [
        { u: url, t: 10000 },
        { u: "https://corsproxy.io/?" + encodeURIComponent(url), t: 15000 },
        { u: "https://api.allorigins.win/raw?url=" + encodeURIComponent(url), t: 15000 }
    ];

    for (let ep of endpoints) {
        try {
            console.log("Trying", ep.u);
            const res = await fetch(ep.u);
            if (res.ok) {
                console.log("SUCCESS");
                return;
            } else {
                console.log("FAIL HTTP", res.status);
            }
        } catch (e) {
            console.warn("Fetch failed for " + ep.u + ":", e.message);
        }
    }
}
testFetch();
