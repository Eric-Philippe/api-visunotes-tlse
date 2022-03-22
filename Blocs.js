const Notes = require("./Notes");
/**
 * Blocs Object
 */
module.exports = class Blocs {
  /**
   * Create a Subject
   * @param {String} code
   * @param {String} label
   */
  constructor(code, label) {
    this.code = code;
    this.label = label;
    /** @type {Array<Notes>} */
    this.notes = [];
  }
  /**
   * Get the code value
   * @return {String} The code value
   */
  getCode() {
    return this.code;
  }
  /**
   * Get the code value
   * @return {String} The code value
   */
  getLabel() {
    return this.label;
  }
  /**
   * Get the code value
   * @return {Array<Notes>} The code value
   */
  getNotes() {
    return this.notes;
  }
  /**
   * Return true if the note already exist in the Array
   * @param {Notes} note
   */
  findNote(note) {
    let index = -1;
    for (let i = 0; i < this.notes.length; i++) {
      if (this.notes[i].equal(note)) {
        index = i;
        break;
      }
    }
    return index;
  }
  /**
   * Add one Notes to the Subject
   * @param {Notes} note
   */
  fillNotes(note) {
    if (this.findNote(note) === -1) return this.notes.push(note);
  }
};
