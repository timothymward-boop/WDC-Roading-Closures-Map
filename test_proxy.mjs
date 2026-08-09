async function test() {
   const res = await fetch('http://localhost:3000/api/proxy/ramm');
   console.log("Status:", res.status);
   const text = await res.text();
   console.log("Text length:", text.length);
   console.log("Starts with:", text.substring(0, 100));
}
test();
