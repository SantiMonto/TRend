const firebaseConfig = {
    apiKey: "AIzaSyDf5UIMl-yWAgMAMxVNodeh2mOcQf6R5dM",
    authDomain: "trender-8bed4.firebaseapp.com",
    projectId: "trender-8bed4",
    storageBucket: "trender-8bed4.appspot.com",
    messagingSenderId: "777425251936",
    appId: "1:777425251936:web:c6bd4adf8823049cda1d05",
    measurementId: "G-BMEV2H4T6M"
  };

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app)

//variables DOM
const cursos_form = document.getElementById('add_curso')

cursos_form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('cursos').add({
        ID: cursos_form.ID.value,
        Curso: cursos_form.Name_Course.value,
        Area: cursos_form.Area.value,
        Instructor: cursos_form.Instructor.value,
        Costo: cursos_form.Precio.value,
        Estado: cursos_form.Estado.value,
    })
})