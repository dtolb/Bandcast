function showError (errorMessage) {
	console.error(errorMessage);
	// TODO: error dialog
}

$(function () {
	var ATTENDEES = "attendees";
	var ORGANIZERS = "organizers";
	_.templateSettings.variable = "value";

	var organizerMessages = [];
	var attendeeMessages = [];
	var organizers = [];
	var attendees = [];

	var $organizerMessages = $(".organizers>.message-list");
	var $attendeeMessages = $(".attendees>.message-list");
	var $organizers = $(".organizer-list");
	var $attendees = $(".attendee-list");
	var $modalBlocker = $(".modal-blocker");

	var messageTemplate = _.template($("#messageTemplate").text().trim());
	var numberTemplate = _.template($("#numberTemplate").text().trim());

	function sortAndSplit (messages) {
		messages = _.sortByOrder(messages, ['timestamp'], [false]);

		// split merged array into separate arrays again
		for (var i = 0; i < messages.length; i++) {
			if (messages[i].to === ORGANIZERS) {
				attendeeMessages[i] = messages[i];
				organizerMessages[i] = null;
			}
			else if (messages[i].to === ATTENDEES) {
				organizerMessages[i] = messages[i];
				attendeeMessages[i] = null;
			}
		}
	}

	function replyToMessage ($replyButton) {
		var username = $replyButton.attr("data-username");

		showCompose("@" + username + " ");
	}

	function createMessageElement (message) {
		var $el = $(messageTemplate(message));
		var $replyButton = $el.find(".reply-button");
		$replyButton.click(replyToMessage.bind($replyButton, $replyButton));
		return $el;
	}

	function refreshLists () {
		function formatTime (message) {
			if (!message) {
				return;
			}
			message.formattedTime = moment(message.timestamp).fromNow();
		}

		_.each(organizerMessages, formatTime);
		_.each(attendeeMessages, formatTime);

		$organizerMessages.empty();
		organizerMessages.forEach(function (value) {
			$organizerMessages.append(createMessageElement(value));
		});

		$attendeeMessages.empty();
		attendeeMessages.forEach(function (value) {
			$attendeeMessages.append(createMessageElement(value));
		});

		$organizers.empty();
		organizers.forEach(function (value) {
			$organizers.append($(numberTemplate(value)));
		});

		$attendees.empty();
		attendees.forEach(function (value) {
			$attendees.append($(numberTemplate(value)));
		});

		refreshOrganizerFromNumbers();
	}

	function load () {
		$.get("/messages")
		.done(function (data) {
			sortAndSplit(data.messages);
			refreshLists();
		})
		.fail(function (err) {
			showError("Failed to refresh message lists.");
		});

		$.get("/users")
		.done(function (data) {
			var users = data.users;
			organizers = _.filter(users, function (item) { return item.role === ORGANIZERS; });
			attendees  = _.filter(users, function (item) { return item.role === ATTENDEES; });
			refreshLists();
		})
		.fail(function (err) {
			showError("Failed to refresh user lists.");
		});
	}

	//poor man's socket
/*	(function loadLoop () {
		load();
		setTimeout(loadLoop, 5000);
	})();*/
	load();

	// the composition controls
	var $composeButton = $(".compose-button");
	var $composeField = $(".compose-field");
	var $composeNumber = $(".compose-number");
	var $sendButton = $(".send-button");
	var $cancelButton = $(".cancel-button");
	var $expand = $(".expand-on-compose");

	function setSendButtonState () {
		var firstChar = $composeField.val()[0];
		if (firstChar === "#") {
			$sendButton.prop("disabled", false).addClass("broadcast").removeClass("reply");
		}
		else if (firstChar === "@") {
			$sendButton.prop("disabled", false).addClass("reply").removeClass("broadcast");
		}
		else {
			$sendButton.prop("disabled", true);
		}
	}

	$composeField.keypress(function (e) {
		if (e.which === 13 && !e.shiftKey) {
			sendMessage();
			return false;
		}
	});

	$composeField.keyup(function () {
		setSendButtonState();
	});

	function refreshOrganizerFromNumbers () {
		var numberItems = [ $("<option disabled selected>Choose a from number...</option>") ];
		organizers.forEach(function (organizer) {
			numberItems.push($("<option value='" + organizer.tn + "'>" + organizer.tn + "</option>"));
		});

		$composeNumber.empty();
		numberItems.forEach(function (number) {
			$composeNumber.append(number);
		});
	}

	function showCompose (initialText) {
		$expand.addClass("expanded");
		$modalBlocker.addClass("show");
		$composeField.val(initialText || "# ");
		$composeField.focus();
		setSendButtonState();
	}

	function hideCompose () {
		$expand.removeClass("expanded");
		$modalBlocker.removeClass("show");
		$composeField.val("");
	}

	$composeButton.click(function () { showCompose(); });
	$cancelButton.click(hideCompose);

	function sendMessage () {
		var payload = {
			text : $composeField.val(),
			from : $composeNumber.val()
		};

		$.post("/messages", payload)
		.done(function () {
			hideCompose();
			// refresh page data
			load();
		})
		.error(function (err) {
			showError("Could not send message. Please try again.");
		});
	}

	$sendButton.click(sendMessage);

	// the user list controls
	var $organizerList = $(".organizer-list");
	var $organizerExpand = $(".organizer-expand-button");
	var $attendeeList = $(".attendee-list");
	var $attendeeExpand = $(".attendee-expand-button");

	function toggleList () {
		var $list = $(this).parent().parent().find(".expand-list");
		$list.toggleClass("expanded");
		$(this).toggleClass("expanded");
	}

	$organizerExpand.click(toggleList);
	$attendeeExpand.click(toggleList);

	// add attendee controls
	var $addAttendeeButton = $(".add-attendee-button");
	var $addOrganizerButton = $(".add-organizer-button");
	var $confirmAddButton = $(".confirm-add-button");
	var $cancelAddButton = $(".cancel-add-button");
	var $addField = $(".add-field");
	var $addDialog = $(".add-dialog");
	var activeRole = null;

	function toggleShowDialog () {
		$addDialog.toggleClass("show");
		if (!$addDialog.hasClass("show")) {
			activeRole = null;
			$modalBlocker.removeClass("show");
		}
		else {
			$modalBlocker.addClass("show");
		}
	}

	// returns either an array of users or false
	function validateNumbers (numbersString, role) {
		var items = numbersString.split(",");
		_.map(items, _.trim);
		var users = [];
		for (var i = 0; i < items.length; i += 3) {
			var item = {
				tn : items[i],
				firstName : items[i + 1] || "",
				lastName : items[i + 2] || "",
				role : role
			};
			users.push(item);
		}

		var valid = _.every(users, function (user) {
			var tnRegex = /\+1[0-9]{10}\b/;
			var nameRegex = /[a-z]*/i;
			return tnRegex.test(user.tn) &&
				!tnRegex.test(user.firstName) &&
				!tnRegex.test(user.lastName) &&
				nameRegex.test(user.firstName) &&
				nameRegex.test(user.lastName);
		});

		if (!valid) return false;
		return users;
	}

	function validateAndSubmitNumbers () {
		var numbersString = $addField.val();
		var users = validateNumbers(numbersString, activeRole);
		if (!users) {
			$addField.addClass("invalid");
		}
		else {
			$addField.removeClass("invalid");
			// submit to api
			_.each(users, function (user) {
				$.post("/users", user)
				.done(function () {
					// refresh page data
					load();
				})
				.error(function (err) {
					showError("Could not add user(s), please try again.");
				});
			});
			toggleShowDialog();
		}
	}

	$addAttendeeButton.click(function () {
		activeRole = ATTENDEES;
		toggleShowDialog();
	});
	$addOrganizerButton.click(function () {
		activeRole = ORGANIZERS;
		toggleShowDialog();
	});

	$cancelAddButton.click(toggleShowDialog);
	$confirmAddButton.click(validateAndSubmitNumbers);

	$modalBlocker.click(function () {
		$expand.removeClass("expanded");
		$(".show").removeClass("show");
	});
});

function deleteUser (deleteButton) {
	var $button = $(deleteButton);
	var tn = encodeURIComponent($button.attr("data-tn"));
	$.ajax({ url : "/users?tn=" + tn, type : "DELETE" })
	.done(function () {
		$button.parent().remove();
	})
	.error(function () {
		showError("Could not delete user, please try again.");
	});
}
