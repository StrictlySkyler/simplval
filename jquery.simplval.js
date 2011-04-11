/******
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*****

PROJECT-		Simpler Validator jQuery Plugin (simplval)
COPYRIGHT-		2011 © Skyler Brungardt
AUTHOR-			Skyler Brungardt
CREATED-		03/29/11
NOTES-			This is a plugin for jQuery validation with more 
				simple validation than the existing plugins at the 
				time of its creation, allowing for more modular 
				implementation.  This plugin is meant to be 
				lightweight, with only the necessary parts - the 
				plugin will only return a true or false value based 
				upon if the field passes validation or not, and is 
				required or not.  For automatic error display, try 
				using the Thick Validator plugin (thickval), which 
				automatically displays errors appropriately if a 
				field fails validation.
REQUIREMENTS-	1.	Most any version of jQuery, recommended 1.2.6 or 
					greater.
				2.	The form element on which this validator is 
					called should have a unique ID attribute.
VERSION-		1.0.0:  Initial release.
******/

//  JQUERY $ NAMESPACE
(function($){

	// BEGIN PLUGIN
	// DECLARE PLUGIN NAME AND ARGS.  TWO ARGUMENTS WHICH SHOULD BE 
	// PASSED ARE THE TYPE OF VALIDATION EXPECTED (POSSIBLE VALUES 
	// ARE STRINGS EQUAL TO THE REGEX VARS BELOW), AND A BOOLEAN 
	// DETERMINING WHETHER THE FORM IS REQUIRED OR NOT.  A CALL TO 
	// THIS PLUGIN SHOULD LOOK LIKE:
	// $("#someID").simplval("checkPhone",false);
	$.fn.simplval = function(type,required) {

		// REGEX VARIABLES FOR FORM FIELD VALIDATION - THIS LIST CAN 
		// BE EXTENDED.  EACH VARIABLE 
		// NAME HERE CAN BE PASSED AS AN ARGUMENT TO THE PLUGIN, 
		// AGAINST WHICH A FORM CAN BE VALIDATED.
		var checkCompoundName = /^[a-z\,\-\. ]*$/i,
			checkEmail = /^[a-z\d\.\-\_\ ]+@[a-z\d\.\-_]{2,}\.[a-z]{2,10}$/i,
			checkPhone = /^[\d \-\(\)\+]*$/,
			checkZIP = /^\d{5}$/,

			// CONTENTS OF THE FIELD BEING VALIDATED
			value = $(this).val(),

			// RETURNED AS TRUEY OR FALSEY BASED ON WHETHER THE 
			// CONTENTS MATCH THE REGEX OR NOT
			validField,

		// FUNCTION TO VALIDATE FIELDS MARKED AS "REQUIRED" BY THE 
		// FORM.  ACCEPTS THREE ARGUMENTS: OBJECT BEING VALIDATED 
		// (USUALLY "this"), REGEX AGAINST WHICH TO TEST, AND TYPE
		// OF FIELD BEING VALIDATED.
			requiredField = function(obj,re) {

			// TEST TO SEE IF THE FIELD PASSES THE REGEX
			var valid = re.test(value);

			// CHECK TO SEE IF THE FIELD IS BLANK, REPORT INVALID IF 
			// SO, SINCE REQUIRED FIELDS CANNOT BE BLANK
			if (value === "") {

				valid = false;
		
			} 

			// REPORT WHETHER FIELD IS VALID OR NOT
			return valid;
		},

		// THIS FUNCTION IS IDENTICAL TO requiredField ABOVE, WITH 
		// THE EXCEPTION THAT BLANK FORM ELEMENTS ARE ALLOWED, SINCE 
		// THIS IS USED TO TEST AGAINST OPTIONAL FIELDS OR NOT.
			optionalField = function(obj,re) {

			var valid = re.test(value);

			return valid;

		};

		// LOGIC TO DETERMINE HOW TO VALIDATE THE FORM, WITH TWO 
		// POSSIBILITIES: THE FORM ELEMENT IS REQUIRED OR IT IS 
		// OPTIONAL.  THESE ARE PASSED TO THE PLUGIN AS BOOLEANS 
		// (TRUE MEANS THE FIELD IS REQUIRED), AND DEFAULT BEHAVIOR 
		// (WITH ANYTHING OTHER THAN TRUEY OR FALSEY VALUES) REPORTS
		// THAT IT NEEDS TO KNOW WHETHER THE FIELD IS REQUIRED OR 
		// NOT, AND THE ARGUMENT IS MISSING.
		switch (required) {

			// IF THE FIELD IS REQUIRED, DETERMINE WHICH KIND OF 
			// VALIDATION TO USE
			case true:

				// THERE SHOULD BE A CASE FOR EACH OF THE KINDS OF 
				// REGEX VARIABLES ABOVE, REPORTING AN ERROR IF 
				// SOMETHING IS CHOSEN THAT ISN'T LISTED HERE
				switch (type) {

					case "compoundName":
						validField = requiredField(this,checkCompoundName);
						break;

					case "email":
						validField = requiredField(this,checkEmail);
						break;
					
					case "phone":
						validField = requiredField(this,checkPhone);
						break;
					
					case "zip":
						validField = requiredField(this,checkZIP);
						break;
					
					default:
						console.log("There's no validation logic for what you chose; you need to build it into the switch statement!");
						break;
				}
				break;

			case false:

				// SAME AS THE SWITCH STATEMENT FOR REQUIRED FORMS, 
				// ABOVE
				switch (type) {
					
					case "compoundName":
						validField = optionalField(this,checkCompoundName);
						break;
					
					case "email":
						validField = optionalField(this,checkEmail);
						break;
					
					case "phone":
						validField = optionalField(this,checkPhone);
						break;
					
					case "zip":
						validField = optionalField(this,checkZIP);
						break;
					
					default:
						console.log("There's no validation logic for what you chose; you need to build it into the switch statement!");
						break;
					}
				break;

			default:
				console.log("You didn't enter the arguments properly!");
				break;
		}

		// RETURN WHETHER THE FIELD PASSED VALIDATION OR NOT WITH A 
		// TRUEY OR FALSEY VALUE
		return validField;

	};
	// END PLUGIN
	
})( jQuery );
//END