var React = require('react');
var Compose = require('./Compose');
var Message = require('./Message');

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
				return (<Message key={message.timestamp} message={message} setComposeText={self.setComposeText}/>);
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