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

	var calculateTotal = function (type) {
		var sum = 0;

		data.allItems[type].forEach(function(cur){
			sum += cur.value;
		});
		data.totals[type] = sum;
	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1,
	};

	return {
		addItem: function(type, des, val){
			var newItem, ID;
			val = parseInt(val);

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
		},
		calculateBudget: function(){
			// calculate total income and exponses
			calculateTotal("exp");
			calculateTotal("inc");

			// Calculate budget
			data.budget = data.totals.inc - data.totals.exp;

			// calculate percentage
			if(data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			}
			else {
				data.percentage = -1;
			}
		},
		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
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
		budgetLabel: ".budget__value",
		incomeLabel: ".budget__income--value",
		expensesLabel: ".budget__expenses--value",
		percentageLabel: ".budget__expenses--percentage"

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
		},
		displayBudget: function(obj) {
			console.log(obj);
			document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
			if(obj.percentage > -1) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
			}
			else {
				document.querySelector(DOMstrings.percentageLabel).textContent = "---";
			}
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

	var updateBudget = function () {
		budgetCtrl.calculateBudget();

		var budget = budgetCtrl.getBudget();

		UICtrl.displayBudget(budget);
	}

	var ctrlAddItem = function() {
		var input, newItem;
		input = UICtrl.getInput();

		if (input.description !== "" && !isNaN(input.value) && input.value != 0) {
			// addItem to datastructure
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// add item to ui
			UICtrl.addListitem(newItem, input.type);

			// clear fields
			UICtrl.clearFiels();

			updateBudget();
		}
	}

	return {
		init: function() {
			setupEventListeners();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
		}
	}

})(budgetController, UIController);

controller.init();