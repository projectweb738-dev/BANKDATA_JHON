async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/folder?modul=kepegawaian&global=true&q=scdv');
    const text = await res.text();
    console.log(res.status, res.statusText);
    console.log(text.substring(0, 200));
  } catch(e) {
    console.error(e);
  }
}
test();
