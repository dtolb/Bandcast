var React = require('react');
var _ = require('lodash');

var Conversation = require('./Conversation');
var UserLists = require('./UserLists');

var common = require('../common');

var App = React.createClass({
	getInitialState : function () {
		return {
			messages : null,
			users : null,
			conversationCollapsed : false
		};
	},

	componentDidMount : function () {
		var self = this;

		self.reload(true);

		(function autoReload () {
			self.reload()
			.then(function () {
				setTimeout(autoReload, 10000);
			});
		})();
	},

	reload : function (forceScroll) {
		var messages;
		var self = this;
		var previousMessageLength = this.state.messages ? this.state.messages.length : 0;

		return common.request({
			method : 'get',
			url : '/messages',
			json : true
		})
		.then(function (body) {
			messages = _.sortByOrder(body.messages, ['timestamp'], [true]);

			return common.request({
				method : 'get',
				url : '/users',
				json : true
			});
		})
		.then(function (body) {
			var users = body.users;

			self.setState({ users : users, messages : messages });

			if (messages.length > previousMessageLength) {
				self.refs.conversation.scrollToBottom(forceScroll);
			}
		});
	},

	sendMessage : function (message) {
		var self = this;

		return common.request({
			method : 'post',
			url : '/messages',
			body : message,
			json : true
		})
		.then(function (body) {
			// ok!
			self.reload();
		});
	},

	toggleConversationCollapsed : function () {
		this.setState({ conversationCollapsed : !this.state.conversationCollapsed });
	},

	render: function() {
		return (
			<div className='app'>
				<Conversation
					messages={this.state.messages}
					users={this.state.users}
					sendMessage={this.sendMessage}
					collapsed={this.state.conversationCollapsed}
					ref='conversation'
					/>
				<UserLists
					users={this.state.users}
					requestParentReload={this.reload}
					toggleConversationCollapsed={this.toggleConversationCollapsed}
					/>
			</div>
		);
	}

});

module.exports = App;