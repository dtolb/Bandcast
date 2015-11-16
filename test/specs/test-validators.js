var validators = require('./../../lib/validators.js');
var config = require('./../../lib/config.js');
var ORGANZIER = config.organizer_string;
var ATTENDEE = config.attendee_sring;

var expect = require('chai').expect;

describe('validators', function () {
	var isE164 = validators.isE164;
	/**************************************************************************
	 * Test isE164 validator
	 *************************************************************************/
	describe('#isE164()', function () {
		it('should validate 11 digit +12345678901', function () {
			expect(isE164('+12345678901')).to.be.true;
		});

		it('should validate 15 digit +123456789012345', function () {
			expect(isE164('+12345678901')).to.be.true;
		});

		it('should not validate 10 digit +1234567890', function () {
			expect(isE164('+1234567890')).to.be.false;
		});

		it('should not validate 16 digit +1234567890123456', function () {
			expect(isE164('+1234567890123456')).to.be.false;
		});

		it('should not validate alphanumerics digit +a1111111111', function () {
			expect(isE164('+1234567890123456')).to.be.false;
		});

		it('should require numbers to start with a +', function () {
			expect(isE164('11111111111')).to.be.false;
		});
	});

	describe('#newUser', function () {
		var newUser = validators.newUser;
		var user;
		describe('when tn is in E164 format', function () {
			before(function () {
				user = {
					tn: '+12223334444'
				};
			});
			after(function () {
				delete user.tn;
				delete user.role;
			});
			describe('but role is undefined', function () {
				it('should return false', function () {
					expect(newUser(user)).to.be.false;
				});
			});
			describe('but role is not "attendees" or "organizers"', function () {
				before(function () {
					user.role = 'not it';
				});
				it('should return false', function () {
					expect(newUser(user)).to.be.false;
				});
			});
			describe('and role is "attendees"', function () {
				before(function () {
					user.role = 'attendees';
				});
				it('should return true', function () {
					expect(newUser(user)).to.be.true;
				});

			});
			describe('and role is "organizers"', function () {
				before(function () {
					user.role = 'organizers';
				});
				it('should return true', function () {
					expect(newUser(user)).to.be.true;
				});
			});
		});

		describe('when role is "attendees" or "organizers"', function () {
			before(function () {
				user = {
					role: 'attendees'
				};
			});
			after(function () {
				delete user.tn;
				delete user.role;
			});
			describe('but tn is undefined', function () {
				it('should return false', function () {
					expect(newUser(user)).to.be.false;
				});
			});
			describe('but tn is not in E164 format', function () {
				before(function () {
					user.tn = '15';
				});
				it('should return false', function () {
					expect(newUser(user)).to.be.false;
				});
			});
		});
	});
	describe('#incomingMessage', function () {
		var incomingMessage = validators.incomingMessage;
		var message;
		describe('when from number isE164', function () {
			before(function () {
				message = {
					from: '+12223334444'
				};
			});
			after(function () {
				delete message.from;
				delete message.text;
			});
			describe('but message doesn\'t have message field', function () {
				it('should return false', function () {
					expect(incomingMessage(message)).to.be.false;
				});
			});
			describe('and message is a string', function () {
				before(function () {
					message.text = '15';
				});
				it('should return true', function () {
					expect(incomingMessage(message)).to.be.true;
				});
			});
			describe('but message is not a string', function () {
				before(function () {
					message.text = 15;
				});
				it('should return false', function () {
					expect(incomingMessage(message)).to.be.false;
				});
			});
		});
		describe('when message is a string', function () {
			before(function () {
				message = {
					text: 'myString'
				};
			});
			after(function () {
				delete message.text;
				delete message.from;
			});
			describe('but message doesn\'t have the from field', function () {
				it('should return false', function () {
					expect(incomingMessage(message)).to.be.false;
				});
			});
			describe('but from isn\'t e164', function () {
				before(function () {
					message.from = 't23';
				});
				it('should return false', function () {
					expect(incomingMessage(message)).to.be.false;
				});
			});
		});
	});
});