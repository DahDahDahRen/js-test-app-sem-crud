"use strict";

//! Model
const model = (function () {
  let _itemsArr = null;
  let _totalAmount = 0;

  class Item {
    constructor(name, price) {
      this.name = name;
      this.price = price;

      this.capitalize();
    }

    capitalize() {
      this.name = this.name[0].toUpperCase() + this.name.slice(1);
    }
  }

  //! Expose model API
  return {
    itemsArr: _itemsArr,
    itemConstructor: Item,
    totalAmount: _totalAmount,
  };
})();

//! Utility
const utility = (function (model) {
  //* Item HTML generator
  function itemHTMLGenerator(itemName, price) {
    return `<li class="list-item d-flex flex-justify-space-between">
                <p class="list-item-name">${itemName}</p> 
                <p class="list-item-price">$ ${price}</p>
            </li>`;
  }

  //* Clear local storage
  function clearLocalStorage() {
    localStorage.clear();
  }

  //* Calculate the total amount
  function calcTotalAmount(arr) {
    return arr.reduce(
      (accumulator, currentValue) => accumulator + currentValue.price,
      0
    );
  }

  //* Calculate percentage
  function calcPercentage(amount) {
    return (amount / model.totalAmount) * 100;
  }

  //! Expose utility API
  return {
    itemHTMLGenerator,
    clearLocalStorage,
    calcTotalAmount,
    calcPercentage,
  };
})(model);

//! Dom Element
const domElement = (function () {
  const _headingOne = document.querySelector(".heading-one");
  const _inputElement = document.querySelector("#input-element");
  const _inputNumberElement = document.querySelector("#input-number");
  const _saveBtn = document.querySelector("#btn-send");
  const _listParentEl = document.querySelector("#list-parent");
  const _totalAmountDisplay = document.querySelector("#total-amount");

  //! Expose domElement private API
  return {
    headingOne: _headingOne,
    inputEl: _inputElement,
    inputNumber: _inputNumberElement,
    saveBtn: _saveBtn,
    listParentEl: _listParentEl,
    totalAmountDisplay: _totalAmountDisplay,
  };
})();

//! App
const app = (function (dom, model, utility) {
  const headingTextContent = `JS Module Pattern and self-invoked function`;

  //! Upon loading of the page
  document.addEventListener("DOMContentLoaded", () => {
    //* Set textcontent of heading
    domElement.headingOne.textContent = headingTextContent;

    // utility.clearLocalStorage();

    //* Check local storage for an items array
    if (!localStorage.getItem("items")) {
      //*No, set array
      model.itemsArr = [];
    } else {
      //* Yes, parse array
      model.itemsArr = JSON.parse(localStorage.getItem("items"));

      //* Generate item HTML and insert them to DOM
      model.itemsArr.forEach((item) => {
        //* Get the name property
        const { name, price } = item;

        //* Generate HTML template
        const html = utility.itemHTMLGenerator(name, price);

        //* Insert it to DOM
        dom.listParentEl.insertAdjacentHTML("afterbegin", html);

        //* Calculate total amount
        const totalAmount = utility.calcTotalAmount(model.itemsArr);

        //* Display the total amount
        dom.totalAmountDisplay.textContent = `$ ${totalAmount}`;
      });
    }
  });

  //! Listen for btn event
  dom.saveBtn.addEventListener("click", function (event) {
    //* Prevent default behaviour
    event.preventDefault();

    //* Check the input value
    if (!dom.inputEl.value && !dom.inputNumber.value) {
      //* Emtpy, prompt the user that input is empty
      alert("Kindly input something in the text input field.");
    } else {
      //* Instantiate a new model
      const item = new model.itemConstructor(
        dom.inputEl.value,
        +dom.inputNumber.value
      );

      //* Push the item element to items arr
      model.itemsArr.push(item);

      //* Generate an HTML element
      const itemHTML = utility.itemHTMLGenerator(item.name, item.price);

      //* Add generated HTML element to DOM
      dom.listParentEl.insertAdjacentHTML("afterbegin", itemHTML);

      //* Calculate total Amount
      const totalAmount = utility.calcTotalAmount(model.itemsArr);

      //* Display total amount
      dom.totalAmountDisplay.textContent = `$ ${totalAmount}`;

      //* Set Total amount
      model.totalAmount = totalAmount;

      //* Save items arr to local storage
      localStorage.setItem("items", JSON.stringify(model.itemsArr));
    }
  });
})(domElement, model, utility);
