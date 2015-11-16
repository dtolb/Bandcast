var React = require('react');
var common = require('../common');
var _ = require('lodash');

var Compose = React.createClass({
	getInitialState : function () {
		return {
			text : '# ',
			from : 'default'
		};
	},

	componentWillReceiveProps : function (props) {
		if (props.users) {
			var organizer = _.find(props.users, function (user) {
				return user.role === common.ORGANIZERS;
			});

			if (organizer) {
				this.setState({ from : organizer.tn });
			}
		}
	},

	onTextChange : function (e) {
		this.setState({ text : e.target.value });
	},

	onFromChange : function (e) {
		this.setState({ from : e.target.value });
	},

	setText : function (text) {
		this.setState({ text : text });
	},

	handleSend : function (event) {
		event.preventDefault();

		var payload = {
			from : this.state.from,
			text : this.state.text.trim()
		};

		this.props.sendMessage(payload)
		.then(function () {
			this.setState({ text : '# ' });
		});
	},

	render: function() {
		var fromOptions =
			this.props.users ?
			this.props.users.map(function (user) {
				if (user.role === common.ORGANIZERS) {
					return (<option value={user.tn} key={user.tn}>Send As: {user.tn}</option>);
				}
			}) :
			null;

		var submitDisabled = true;
		if (this.refs.text) {
			submitDisabled =
				this.refs.text.value.indexOf('#') !== 0 &&
				this.refs.text.value.indexOf('@') !== 0;
		}

		var submitMessage = submitDisabled ? 'Start message with # to broadcast, @ to reply' : 'Send';

		return (
			<form className='compose-form' onSubmit={this.handleSend}>
				<select ref='from' className='compose-form-from' value={this.state.from} onChange={this.onFromChange}>
					<option disabled value='default'>No Organizers!</option>
					{fromOptions}
				</select>
				<textarea ref='text' className='compose-form-input' value={this.state.text} onChange={this.onTextChange}></textarea>
				<input type='submit' className='compose-form-send' value={submitMessage} disabled={submitDisabled} />
			</form>
		);
	}
});

module.exports = Compose;