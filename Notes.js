/**
 * Notes object
 */
module.exports = class Notes {
  /**
   * Constructor of the Notes Object
   * @param {String} code Under code of the Note
   * @param {Number} result Result of the Note
   * @param {String} label Label corresponding to the Note
   */
  constructor(code, result, label) {
    this.code = code;
    this.result = result;
    this.label = label;
  }
  /**
   * Get the code value
   * @return {String} The code value
   */
  getCode() {
    return this.code;
  }
  /**
   * Get the result value
   * @return {Number} The result value
   */
  getResult() {
    return this.result;
  }
  /**
   * Get the label value
   * @return {String} The label value
   */
  getLabel() {
    return this.label;
  }
  /**
   * Compare if two notes are equals
   * @param {Notes} note
   */
  equal(note) {
    return (
      note.code === this.code &&
      note.result === this.result &&
      note.label === this.label
    );
  }
};
