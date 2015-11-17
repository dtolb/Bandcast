var React = require('react');
var Compose = require('./Compose');
var Message = require('./Message');
var _ = require('lodash');
var common = require('../common');

var Conversation = React.createClass({

	setComposeText : function (text) {
		this.refs.compose.setText(text);
	},

	scrollToBottom : function (force) {
		var list = this.refs.list;
		if (force || list.scrollHeight - list.offsetHeight - list.scrollTop > 10) {
			list.scrollTop = list.scrollHeight;
		}
	},

	render: function() {
		var self = this;

		var messageNodes =
			this.props.messages ?
			this.props.messages.map(function (message) {
				var isOrganizerMessage = Boolean(_.find(self.props.users, function (user) {
					return user.role === common.ORGANIZERS && user.tn === message.from;
				}));
				return (<Message key={message.timestamp} message={message} isOrganizerMessage={isOrganizerMessage} setComposeText={self.setComposeText}/>);
			}) :
			(<div className='loading'>Loading</div>);

		var className = [
			'conversation',
			this.props.collapsed ? 'collapsed' : ''
		].join(' ');

		return (
			<div className={className}>
				<div className='message-list' ref='list'>
					{messageNodes}
				</div>
				<Compose sendMessage={this.props.sendMessage} users={this.props.users} ref='compose'/>
			</div>
		);
	}

});

module.exports = Conversation;