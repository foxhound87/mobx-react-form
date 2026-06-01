import { expect } from "chai";

import { FormInterface } from "../../src/models/FormInterface";
import $ from "../fixtures/_.fixes"; // FORMS


describe("Check Fixes $425 labels", () => {
  it("$425 labels() check", () =>
    expect($.$425.labels()).to.be.deep.equal({
      "1a": "1aa",
      "2a": "2aa",
      "3a": "3aa",
    }));
});


