const mongoRadio = document.getElementById('mongo');
const sqliteRadio = document.getElementById('sqlite');

function switchDatabase(dbName) {
    fetch(`/switch-db?db=${dbName}`)
        .then(res => res.text())
        .then(console.log)
        .catch(console.error);
}

mongoRadio.addEventListener('change', () => {
    if (mongoRadio.checked) {
        switchDatabase('mongo');
    }
});

sqliteRadio.addEventListener('change', () => {
    if (sqliteRadio.checked) {
        switchDatabase('sqlite');
    }
});

