import http from 'http';
import https from 'https';

https.get("https://map-auea.ramm.com/v2/mapping/settingdata/296/dc7b8b7b-4273-485a-94a7-4fd02723f982/?format=geojson&forcePoint=false", (res) => {
    console.log('Status:', res.statusCode);
}).on('error', (e) => {
    console.error(e);
});
