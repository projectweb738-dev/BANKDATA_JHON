async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/folder?modul=kepegawaian&global=true&q=scdv');
    const data = await res.json();
    console.log(data);
  } catch(e) {
    console.error(e);
  }
}
test();
