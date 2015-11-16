var expect = require('chai').expect;

describe('Creating new user:', function () {
	describe('When an unknown user texts "start" to Bandcast', function () {
		describe('it should create a new catapult sms', function () {
			it('should contain user\'s tn in catapult payload', function () {});
			it('should set the fromNumber as the Bandcast number', function () {});
			it('should set the body to attendee welcome message', function () {});
		});
		describe('the user should be returned via GET /users', function () {
			it('should assign username', function () {});
			it('should set the tn to tn of user', function () {});
			it('should not set firstName', function () {});
			it('should not set lastName', function () {});
		});
	});
	describe('When an unknown user texts the secret code to Bandcast', function () {
		describe('it should create a new organizer sms', function () {
			it('should contain user\'s tn in catapult payload', function () {});
			it('should set the fromNumber as the Bandcast number', function () {});
			it('should set the body to organizer welcome message', function () {});
		});
		describe('the user should be returned via GET /users', function () {
			it('should not assign username', function () {});
			it('should set the tn to tn of user', function () {});
			it('should not set firstName', function () {});
			it('should not set lastName', function () {});
			it('should set the role to "organizers"', function () {});
		});
	});
	describe('When an HTTP POST request to /users is made', function () {
		describe('but the POST body.role is not attendees || organizers', function () {
			it('should return status 400', function () {});
		});
		describe('but the POST body.tn is not e164', function () {
			it('should return status 400', function () {});
		});
		describe('but the POST firstName is not a string', function () {
			it('should return status 400', function () {});
		});
		describe('but the POST lastName is not a string', function () {
			it('should return status 400', function () {});
		});
		describe('but the POST body is empty', function () {
			it('should return status 400', function () {});
		});
		describe('but the POST body.role is not provided', function () {
			it('should return status 400', function () {});
		});
		describe('but the POST body.tn is not provided', function () {
			it('should return status 400', function () {});
		});
		describe('and the POST body is valid', function () {
			describe('but the user exists', function () {
				it('should return 400', function () {});
				it('should return message \'User exists\'', function () {});
			});
			describe('and the user does not exist', function () {
				describe('and the role is "attendees"', function () {
					describe('it should create a new catapult sms', function () {
						it('should contain user\'s tn in catapult payload',
							function () {});
						it('should set the fromNumber as the Bandcast number',
							function () {});
						it('should set the body to attendee welcome message',
							function () {});
					});
					describe('it should add the user as an attendee', function () {
						it('the user is returned from GET /users', function () {});
					});
					describe('it should return', function () {
						it('with status 201', function () {});
						it('with user object in body', function () {});
					});
				});
				describe('and the role is "organizer"', function () {
					describe('it should create a new catapult sms', function () {
						it('should contain user\'s tn in catapult payload',
							function () {});
						it('should set the fromNumber as the Bandcast number',
							function () {});
						it('should set the body to organizer welcome message',
							function () {});
					});
					describe('it should add the user as an organizer', function () {
						it('the user is returned from GET /users', function () {});
					});
					describe('it should return', function () {
						it('with status 201', function () {});
						it('with user object in body', function () {});
					});
				});
			});
		});
	});
});
