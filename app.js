var budgetController = (function(){
	var Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}

	var Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
	};

	return {
		addItem: function(type, des, val){
			var newItem, ID;

			// create ID
			var ID = (data.allItems[type].length > 0) ? data.allItems[type][data.allItems[type].length - 1].id + 1 : 0;
			// create item 
			if (type === "inc") {
				newItem = new Income(ID, des, val);
			} else if(type === "exp") {
				newItem = new Expense(ID, des, val);
			}

			data.allItems[type].push(newItem);

			return newItem;
		}
	}
})();

var UIController = (function(){
	
	var DOMstrings = {
		inputType: ".add__type",
		inputDescription: ".add__description",
		inputValue: ".add__value",
		inputButton: ".add__btn",
		expensesContainer: ".expenses__list",
		incomeContainer: ".income__list",
	}

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMstrings.inputType).value, //will be inc or exp
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: document.querySelector(DOMstrings.inputValue).value,
			}
		},
		getDOMstrings: function() {
			return DOMstrings;
		}, 
		addListitem: function(obj, type) {
			// create HTML string
			var html, newHtml, element;
			if (type === "inc") {
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
			} else {
				element = DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}

			// replate placeholder text with actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);

			// Insert html into the dom
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},
		clearFiels: function() {
			var fields, fieldsArr;
			fields = DOMstrings.inputDescription + ","+ DOMstrings.inputValue;
			fields = document.querySelectorAll(fields);

			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(field){
				field.value = "";
			});

			fieldsArr[0].focus();
		}
	}

})();

var controller = (function(budgetCtrl, UICtrl){

	var setupEventListeners = function () {
		var DOM = UICtrl.getDOMstrings();
		document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem);

		document.addEventListener('keypress', function(e){
			
			if (e.keyCode === 13 || e.which === 13) {
				ctrlAddItem();
			} 
		
		});
	}

	var ctrlAddItem = function() {
		var input, newItem;
		input = UICtrl.getInput();

		// addItem to datastructure
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);

		// add item to ui
		UICtrl.addListitem(newItem, input.type);

		// clear fields
		UICtrl.clearFiels();
	}

	return {
		init: function() {
			setupEventListeners();
		}
	}

})(budgetController, UIController);

controller.init();