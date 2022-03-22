// Import required modules
const fs = require("file-system");
const puppeteer = require("puppeteer");
var _ = require("lodash");
// Import own object
const Blocs = require("./Blocs"); // Blocs Object
const Notes = require("./Notes"); // Notes Object

/** @const {String} [main link to the note website] */
const MAIN_LINK = "https://notes.info.iut-tlse3.fr/php/visuNotes.php";
/**
 * Manager of the final Notes Array
 */
module.exports = class NotesManager {
  /**
   * Constructor of the NotesManager Entity
   * @param {Array<String>} logs
   * @param {String} prefix
   * @param {String} suffix
   */
  constructor(logs, prefix, suffix) {
    /** @private @type {Array<Blocs>} */
    this.blocs = [];
    /** @private @type {String} */
    this.username = logs[0];
    /** @private @type {String} */
    this.password = logs[1];
    /** @private @type {String} */
    this.prefix = prefix;
    /** @private @type {String} */
    this.suffix = suffix;
  }
  /**
   * Get the Blocs Array
   * @return {Array<Blocs>} The complete Array of Blocs
   */
  getNotes() {
    return this.blocs;
  }
  /**
   * Load and Return the text from the Body
   *
   * @return {String} All the text body from the webPage
   */
  async #loadBodyText() {
    const browser = await puppeteer.launch(); // Launch a new browser instance
    const page = await browser.newPage(); // Create a new page Object
    await page.goto(MAIN_LINK); // goTo specific URL
    // Input Manager
    const elHandleArray = await page.$$("input"); // Get all the input fields of the page
    if (!elHandleArray[0] || !elHandleArray[1]) throw "NO_INPUT_FIELDS"; // Check if input still exists

    await elHandleArray[0].type(this.username); // Input username
    await elHandleArray[1].type(this.password); // Input password

    await page.$$eval(
      "button",
      (elHandles) => elHandles.forEach((el) => el.click()) // Log with the current credits
    );

    await page.waitForNavigation(); // Wait the page to be loaded

    // Get the data of the login request
    let data = await page.evaluate(() => {
      let fullTxt = document.body.innerText; // Get all the text content of the body
      // Site doesn't have any class / id
      return fullTxt;
    });

    await browser.close(); // Close the current browser

    if (data.includes("Authenfication LDAP echouee")) throw "LOGIN_FAILED"; // Fail of the input logs

    return data;
  }

  async loadNotes() {
    // Treatment of the full text
    let data = await this.#loadBodyText().catch((err) => {
      throw err;
    });
    let words = await data.split(/\r\n|\r|\n/); // Get all element by line
    let current_code = ""; // Current code of the bloc working on
    let currentBloc;
    // Loop all around the lines
    for (const element of words) {
      let args = element.split(" "); // Split all the line by white space
      // Parse by their home format CODE00-LETTERNUMBE
      if (args[0].startsWith(this.prefix)) {
        // Each level got their own prefix
        if (!args[0].includes(this.suffix)) {
          if (currentBloc) this.blocs.push(currentBloc);
          // Each new bloc (Bloc doesn't have any suffix)
          current_code = args[0]; // Fix the memory on the current bloc

          let j = 2; // Starting from after the bloc's code
          let blocLabel = ""; // Name of the bloc

          // Loop all around the next arguments of the line and push it to the labelBloc
          while (args[j]) {
            blocLabel = blocLabel + " " + args[j]; // Adding space between
            j++; // Next element
          }
          currentBloc = new Blocs(current_code, blocLabel);
        } else {
          // Get current state of the exam (Graded or not)
          let state = args[args.length - 1].split("\t\t"); // Split with the parent format (Two carriage returns)
          state = state[state.length - 1]; // Take only the last element

          // Get the label of the exam
          let fullLineLabel = args[2]; // Get the third element of the line
          if (args[3]) fullLineLabel = fullLineLabel + " " + args[3]; // Can be composed by two words
          let label = fullLineLabel.split("	")[0]; // Remove useless stuff

          let result = !isNaN(state) ? state : -1;
          // Check if the bloc exists
          currentBloc.fillNotes(new Notes(args[0], result, label));
        }
      }
    }
    if (currentBloc) this.blocs.push(currentBloc);
    if (!this.blocs.length > 0) throw "WRONG_PREFIX_OR_SUFFIX"; // Error handler
  }
  /**
   * @typedef {Object} Difference
   * @property {String} state
   * @property {Notes} note
   * @property {String} bloc
   * @property {String} codeBloc
   *
   */
  /**
   * Return all the exams updated
   *
   * @param {Array<Blocs>} oldArray
   * @param {Array<Blocs} newArray
   * @return {Array<Difference>}
   */
  isDifferent(oldArray, newArray) {
    if (oldArray === newArray) return false; // Check if first children arrays are the same
    let difference = []; // Final array of difference, allow multiples differences
    let currentNote;
    // Loop all around the both arrays Blocs
    for (let i = 0; i < oldArray.length; i++) {
      // Loop all around the whole exams of a Bloc
      for (let j = 0; j < oldArray[i].notes.length; j++) {
        currentNote = new Notes(
          oldArray[i].notes[j].code,
          oldArray[i].notes[j].result,
          oldArray[i].notes[j].label
        );
        if (!newArray[i].notes[j].equal(currentNote)) {
          let state = "UNKNOWN";
          if (
            currentNote.getResult() === -1 &&
            newArray[i].notes[j].getResult() > -1
          ) {
            state = "GRADE_ADDED";
          } else if (
            newArray[i].notes[j].getResult() === -1 &&
            currentNote.getResult() > -1
          ) {
            state = "GRADE_REMOVED";
          }
          difference.push({
            state: state,
            note: newArray[i].notes[j], // Notes
            bloc: newArray[i].getLabel(), // Label
            codeBloc: newArray[i].getCode(), // Notes Object
          });
        }
      }
    }
    return difference; // Return the final array
  }

  /**
   * Return if the current object is the same as another one
   *
   * @param {Array<Blocs} newArray
   * @return {Boolean}
   */
  isEqual(newArray) {
    if (this.blocs === newArray) return false; // Check if first children arrays are the same
    let equal = true;
    // Loop all around the both arrays Blocs
    for (let i = 0; i < this.blocs.length; i++) {
      // Loop all around the whole exams of a Bloc
      for (let j = 0; j < this.blocs[i].notes.length; j++) {
        if (!this.blocs[i].notes[j].equal(newArray[i].notes[j])) {
          equal = false;
          break;
        }
      }
    }
    return equal; // Return the final array
  }

  /**
   * Write a file with the Object
   */
  async toJSON() {
    if (this.blocs.length === 0) throw "EMPTY_ARRAY";

    let data = JSON.stringify(this.blocs, null, 4);
    await fs.writeFile(`${this.username}.json`, data, (err) => {});
  }

  /**
   * Compare if the Object is the same as one written in a Json File
   * @param {String} filename
   * @return {Array<Blocs>}
   */
  async JSONtoJS(filename) {
    const data = await fs.readFileSync(filename, {
      encoding: "utf8",
      flag: "r",
    });
    let parsedData = await JSON.parse(data.toString()); // Parse the Json file
    if (!parsedData) throw "EMPTY_OR_UNVALID_FILE"; // Error Handler

    return parsedData; // Boolean return
  }
};
