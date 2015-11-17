var React = require('react');
var _ = require('lodash');
var common = require('../common');

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

var AddUsers = React.createClass({
	getInitialState : function () {
		return {
			usersRaw : '',
			expanded : false
		};
	},

	usersRawChanged : function (e) {
		this.setState({ usersRaw : e.target.value });
	},

	keyPressed : function (e) {
		if (e.which === 10 || e.which === 13) {
			e.preventDefault();
			this.handleSubmit();
		}
	},

	handleSubmit : function (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		var self = this;

		var validated = validateNumbers(this.state.usersRaw, this.props.role);
		if (validated) {
			_.each(validated, function (user) {
				self.props.addUser(user)
				.then(function () {
					self.setState({ usersRaw : '' });
				});
			});
		}
		else {
			alert('Please check the syntax of the submitted users.');
		}
	},

	toggleExpand : function () {
		this.setState({ expanded : !this.state.expanded });
	},

	render: function() {
		var mainClass = this.state.expanded ? 'add-users expanded' : 'add-users';

		return (
			<div className={mainClass}>
				<button className='add-users-expand' onClick={this.toggleExpand}>Add {this.props.role}</button>
				<form className='add-users-form' onSubmit={this.handleSubmit}>
					<textarea
						value={this.state.usersRaw}
						onChange={this.usersRawChanged}
						onKeyPressed={this.keyPressed}
						className='add-users-input'
						placeholder='csv format: +15553334444,firstName,lastName,+15553334445...'
						></textarea>
					<input type='submit' value='Add'/>
				</form>
			</div>
		);
	}

});

module.exports = AddUsers;