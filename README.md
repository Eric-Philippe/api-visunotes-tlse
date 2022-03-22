<img width="150" height="95" align="left" style="float: left; margin: 0 10px 0 0;" alt="Cril" src="https://cdn.discordapp.com/attachments/739553949199106158/937150810431823912/logoIUT.jpg">

# API VisuNotes TOULOUSE3

---

A simple "API like" to fetch grade on the school website. (IUT Informatique [FR]Toulouse Paul Sabatier). Everything is developed under two NPM dependencies (lodash & puppeteer), all in JavaScript (NodeJs).

---

## Links

- [VisuNotes](https://notes.info.iut-tlse3.fr/php/visuNotes.php)
- [GitHub](https://github.com/Zaorhion/api-visunotes-tlse3)
- [npm](https://www.npmjs.com/package/api-visunote-tlse3)

---

## Function

---

This API export Notes, Blocs and the NotesManager Objects to work with.
Everything is synchrone and allow not to load every pieces at the same time.

```js
const vn = require("api-visunotes-tlse3");
const notes = require("file_name.json");

myNotes = new NotesManager(["USERNAME", "PASSWORD"], "PREFIX", "SUFFIX");
myNotes.loadNotes();
myNotes.toJSON();

yourNotes = newNotesManager();
yourNotes.JSONtoJS(notes);

yourNotes.isEqual(myNotes.getNotes());
```

---

## License

This API is licensed under the GNU 3.0 license. See the file `LICENSE` for more information. If you plan to use any part of this source code in your own bot, I would be grateful if you would include some form of credit somewhere.

## Author

@Zaorhion : Eric PHILIPPE
Discord : Sunrise#1318
