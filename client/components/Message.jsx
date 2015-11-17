var React = require('react');
var common = require('../common');
var moment = require('moment');

var Message = React.createClass({
	reply : function () {
		this.props.setComposeText('@' + this.props.message.from + ' ');
	},

	render: function() {
		var messageTypeClass =
			this.props.message.to === common.ATTENDEES ?
			'organizer-message' :
			'attendee-message';

		var className = [
			'message',
			messageTypeClass
		].join(' ');

		var time = moment(this.props.message.timestamp).fromNow();

		return (
			<div className={className}>
				<div className='message-from'>{this.props.message.from}</div>
				<div className='message-text'>{this.props.message.text}</div>
				<div className='message-timestamp'>{time}</div>
				<div className='message-controls'>
					<div className='message-reply' onClick={this.reply}><i className='fa fa-reply'></i></div>
				</div>
			</div>
		);
	}

});

module.exports = Message;