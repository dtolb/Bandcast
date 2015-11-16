var expect = require('chai').expect;

describe('When attendee messages broadcast number', function () {
	describe('and the body text is more than just "stop" or "start"', function () {
		describe('and there is at least one organizer', function () {
			it('should create a new catapult sms for each organizer', function () {});
		});
		describe('and there are no organizers', function () {
			it('should not attempt to create a sms', function () {});
		});
	});
	describe('and the body text is stop', function () {
		it('should create a new catapult sms confirming removal', function () {});
		describe('and when an organizer sends a new sms', function () {
			it('that attendee should not recieve the sms', function () {});
		});
	});
	describe('and the body text is "start"', function () {
		it('should not create a new catapult sms', function () {});
	});
});

describe('When organizer messages broadcast number', function () {
	describe('and the body text is more than just "stop" or "start"', function () {
		describe('and there is at least one attendee', function () {
			before(function () {});
			after(function () {});
			it('should create a new catapult sms for each attendee', function () {});
		});
		describe('and there are no attendees', function () {
			it('should not attempt to create a sms', function () {});
		});
	});
	describe('and the body text is "stop"', function () {
		it('should create a new catapult sms confirming removal', function () {});
		describe('when an attendee sends a new sms', function () {
			it('that organizer should not recieve the sms', function () {});
		});
	});
	describe('and the body text is "start"', function () {
		it('should not create a new catapult sms', function () {});
	});
});

describe('When an unknown user messages broadcast number', function () {
	describe('and the text body is not "start" or "stop"', function () {
		it('should create a new catapult sms with instructions', function () {});
	});
	describe('and the text body is "stop"', function () {
		it('should not attempt to create a sms', function () {});
	});
	describe('and the text body is "start"', function () {
		it('should create a new catapult sms confirming subsciption', function () {});
		describe('and when an organizer sends a new sms', function () {
			it('the user should recieve the new sms', function () {});
		});
	});
});
