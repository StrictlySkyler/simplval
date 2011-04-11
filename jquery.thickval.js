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

PROJECT-		Thick Validator jQuery Plugin (thickval)
COPYRIGHT-		2011 © Skyler Brungardt
AUTHOR-			Skyler Brungardt
CREATED-		03/29/11
NOTES-			This plugin is an extension of the simplval plugin, including error display 
				for invalid fields.
REQUIREMENTS-	1.	Most any version of jQuery, recommended 1.2.6+.
				2.	The form element on which this validator is called should have a unique ID 
				attribute.
VERSION-		1.0.0:  Initial release.
******/

//  JQUERY $ NAMESPACE
(function($){

	// BEGIN PLUGIN
	// DECLARE PLUGIN NAME AND ARGS.  TWO ARGUMENTS WHICH SHOULD BE PASSED ARE THE TYPE OF 
	// VALIDATION EXPECTED (POSSIBLE VALUES ARE STRINGS EQUAL TO THE REGEX VARS BELOW), AND A 
	// BOOLEAN DETERMINING WHETHER THE FORM IS REQUIRED OR NOT.
	$.fn.thickval = function(type,required) {

		//REGEX VARIABLES FOR FORM FIELD VALIDATION - THIS LIST CAN BE EXTENDED.  EACH VARIABLE 
		// NAME HERE CAN BE PASSED AS AN ARGUMENT TO THE PLUGIN, AGAINST WHICH A FORM CAN BE 
		// VALIDATED.
		var checkCompoundName = /^[a-z\,\-\. ]*$/i,
			checkEmail = /^[a-z\d\.\-\_\ ]+@[a-z\d\.\-_]{2,}\.[a-z]{2,10}$/i,
			checkPhone = /^[\d \-\(\)\+]*$/,
			checkZIP = /^\d{5}$/,

			// ERRORS TO ASSOCIATE WITH SPECIFIC KINDS OF VALIDATION.  THESE SHOULD MATCH THE 
			// REGEX USED ABOVE, WITH THE ADDITION OF ONE FOR BLANK FIELDS.
			blankError = "<p>This field cannot be blank.</p>",
			compoundNameError = "<p>Only letters, hyphens, spaces, and periods are allowed.</p>",
			emailError = "<p>Please enter a valid email address.</p>",
			phoneError = "<p>Please enter a valid phone number.</p>",
			ZIPError = "<p>Please enter a valid ZIP code.</p>",

			// CONTENTS OF THE FIELD BEING VALIDATED
			value = $(this).val(),

			// RETURNED AS TRUEY OR FALSEY BASED ON WHETHER THE CONTENTS MATCH THE REGEX OR NOT
			validField,

		// FUNCTION TO VALIDATE FIELDS MARKED AS "REQUIRED" BY THE FORM.  ACCEPTS THREE 
		// ARGUMENTS: OBJECT BEING VALIDATED (USUALLY "this"), REGEX AGAINST WHICH TO TEST, AND 
		// TYPE OF FIELD BEING VALIDATED.
			requiredField = function(obj,re,type) {

			// TEST TO SEE IF THE FIELD PASSES THE REGEX
			var valid = re.test(value),

			// ASSIGN THE ERROR MESSAGE LOCATION RELATIVE TO THE FIELD BEING TESTED
				top = ($(obj).position().top) + 2,
				left = ($(obj).position().left) + ($(obj).width()) + 10,

			// CREATE A UNIQUE ID FOR THE ERROR, BASED UPON THE UNIQUE ID OF THE FORM ELEMENT 
			// BEING VALIDATED.  THIS WILL BEHAVE ERRATICALLY IF THE OBJECT DOESN'T HAVE A 
			// UNIQUE ID.
				errorId = $(obj).attr("id") + "Error";

			// CHECK TO SEE IF THE FIELD IS BLANK, AND CREATE APPROPRIATE ERROR IF SO
			if (value === "") {

				// CHECK TO SEE IF ERROR ALREADY EXISTS
				if ($("#"+errorId).text() === "") {

					// CREATE BLANK ERROR
					$(obj).after(blankError);
					$(obj).next().attr("id",errorId);

				} else {
				
					// REPLACE EXISTING ERROR WITH BLANK ERROR
					$("#"+errorId).replaceWith(blankError);
					$(obj).next().attr("id",errorId);

				}

				$("#"+errorId).css("display","block");
				$("#"+errorId).css("color","#f00");
				$("#"+errorId).css("position","absolute");
				$("#"+errorId).css("top", top);
				$("#"+errorId).css("left", left);
				$(obj).addClass("errorBorder");

				// REPORT THAT FIELD IS NOT VALID, SINCE REQUIRED FIELDS CANNOT BE BLANK
				valid = false;

			// CHECK TO SEE IF FIELD HAS IMPROPER DATA
			} else if (!valid) {
		
				// SAME AS ABOVE - CREATE THE ERROR IF IT DOESN'T EXIST ALREADY, OR REPLACE IT 
				// WITH THE APPROPRIATE ERROR IF IT DOES
				if ($("#"+errorId).text() === "") {

					$(obj).after(type);
					$(obj).next().attr("id",errorId);
					

				} else {
		
					$("#"+errorId).replaceWith(type);
					$(obj).next().attr("id",errorId);
					
				}

				$("#"+errorId).css("display","block");
				$("#"+errorId).css("color","#f00");
				$("#"+errorId).css("position","absolute");
				$("#"+errorId).css("top", top);
				$("#"+errorId).css("left", left);
				$(obj).addClass("errorBorder");
		
			// IF THE FIELD IS VALID AND NOT BLANK, PROCEED
			} else if ((valid) && (value !== "")) {
		
				// HIDE THE ERROR MESSAGE IF IT EXISTS
				if ($("#"+errorId).css("display") === "block") {
		
					$("#"+errorId).css("display","none");
					$(obj).removeClass("errorBorder");
				}
			}

			// REPORT WHETHER FIELD IS VALID OR NOT
			return valid;
		},

		// THIS FUNCTION IS IDENTICAL TO requiredField ABOVE, WITH THE EXCEPTION THAT BLANK 
		// FORM ELEMENTS ARE ALLOWED, SINCE THIS IS USED TO TEST AGAINST OPTIONAL FIELDS OR NOT.
			optionalField = function(obj,re,type) {

			var valid = re.test(value),
				top = $(obj).position().top + 2,
				left = $(obj).position().left + $(obj).width() + 10,
				errorId = $(obj).attr("id") + "Error";

			if (!valid) {
		
				if ($("#"+errorId).text() === "") {

					$(obj).after(type);
					$(obj).next().attr("id",errorId);

				} else {
		
					$("#"+errorId).replaceWith(type);
					$(obj).next().attr("id",errorId);
					
				}

				$("#"+errorId).css("display","block");
				$("#"+errorId).css("color","#f00");
				$("#"+errorId).css("position","absolute");
				$("#"+errorId).css("top", top);
				$("#"+errorId).css("left", left);
				$(obj).addClass("errorBorder");
		
			} else if (valid) {
		
				if ($("#"+errorId).css("display") === "block") {
		
					$("#"+errorId).css("display","none");
					$(obj).removeClass("errorBorder");
				}
			}

			return valid;
		};

		// LOGIC TO DETERMINE HOW TO VALIDATE THE FORM, WITH TWO POSSIBILITIES: THE FORM 
		// ELEMENT IS REQUIRED OR IT IS OPTIONAL.  THESE ARE PASSED TO THE PLUGIN AS BOOLEANS; 
		// TRUE IS REQUIRED, FALSE IS OPTIONAL, AND DEFAULT BEHAVIOR (WITH ANYTHING OTHER THAN 
		// TRUEY OR FALSEY VALUES) REPORTS THAT IT NEEDS TO KNOW WHETHER THE FIELD IS 
		// REQUIRED OR NOT, AND THE ARGUMENT IS MISSING.
		switch (required) {

			// IF THE FIELD IS REQUIRED, DETERMINE WHICH KIND OF VALIDATION TO USE
			case true:

				// THERE SHOULD BE A CASE FOR EACH OF THE KINDS OF REGEX VARIABLES ABOVE, 
				// REPORTING AN ERROR IF SOMETHING IS CHOSEN THAT ISN'T LISTED HERE
				switch (type) {

					case "compoundName":
						validField = requiredField(this,checkCompoundName,compoundNameError);
						break;

					case "email":
						validField = requiredField(this,checkEmail,emailError);
						break;
					
					case "phone":
						validField = requiredField(this,checkPhone,phoneError);
						break;
					
					case "zip":
						validField = requiredField(this,checkZIP,ZIPError);
						break;
					
					default:
						console.log("There's no validation logic for what you chose; you need to build it into the switch statement!");
						break;
				}
				break;

			case false:

				// SAME AS THE SWITCH STATEMENT FOR REQUIRED FORMS, ABOVE
				switch (type) {
					
					case "compoundName":
						validField = optionalField(this,checkCompoundName,compoundNameError);
						break;
					
					case "email":
						validField = optionalField(this,checkEmail,emailError);
						break;
					
					case "phone":
						validField = optionalField(this,checkPhone,phoneError);
						break;
					
					case "zip":
						validField = optionalField(this,checkZIP,ZIPError);
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

		// RETURN WHETHER THE FIELD PASSED VALIDATION OR NOT WITH A TRUEY OR FALSEY VALUE
		return validField;

	};
	// END PLUGIN
	
})( jQuery );
//END