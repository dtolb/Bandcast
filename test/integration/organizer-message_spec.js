var expect = require('chai').expect;

describe('When an Organizer texts the Bandcast Number', function () {
	describe('but does not begin the message with a symbol or phrase', function () {
		describe('it should create a new catapult message', function () {
			it('should contain the user\'s tn', function () {});
			it('should set the fromNumber as the Bandcast number', function () {});
			it('should set the body to Invalid Message', function () {});
		});
	});
	describe('and the message is "help"', function () {
		describe('it should create a new catapult message', function () {
			it('should contain the user\'s tn', function () {});
			it('should set the fromNumber as the Bandcast number', function () {});
			it('should set the body to Instructions Message', function () {});
		});
	});
	describe('and the message begins with "#"', function () {
		describe('the message should be returned via GET /messages', function () {
			it('should set the fromNumber to the Organizer\'s number', function () {});
			it('should set the to: to attendees', function () {});
			it('should set the timestamp to: ', function () {});
			it('should set the text to the text without the "#"', function () {});
		});
		describe('but there are no attendees', function () {
			it('should not create a catapult sms', function () {});
		});
		describe('and there is one attendee', function () {
			describe('should only create one catapult sms', function () {
				it('should contain the attendee tn', function () {});
				it('should remove the "#"', function () {});
				it('should set fromNumber to the Bandcast Number', function () {});
			});
		});
	});
});