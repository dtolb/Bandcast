var React = require('react');
var common = require('../common');
var moment = require('moment');

var Message = React.createClass({
	reply : function () {
		this.props.setComposeText('@' + this.props.message.username + ' ');
	},

	render: function() {
		var classes = [ 'message' ];
		var iconClass;

		if (this.props.isOrganizerMessage) {
			classes.push('organizer-message');

			if (this.props.message.to !== common.ATTENDEES) {
				classes.push('whisper');
				iconClass = 'message-icon fa fa-reply';
			}
			else {
				iconClass = 'message-icon fa fa-bullhorn';
			}
		}
		else {
			classes.push('attendee-message');
			iconClass = 'message-icon hidden';
		}

		var className = classes.join(' ');

		var time = moment(this.props.message.timestamp).fromNow();

		// .message-to will be hidden unless this is a whisper by css
		return (
			<div className={className}>
				<div className='message-from'>{this.props.message.from}</div>
				<div className='message-to'>to: {this.props.message.to}</div>
				<div className='message-text'>{this.props.message.text}</div>
				<div className='message-timestamp'>{time}</div>
				<div className='message-controls'>
					{
						!this.props.isOrganizerMessage ?
						<div className='message-reply' onClick={this.reply}><i className='fa fa-reply'></i></div> :
						null
					}
				</div>
				<i className={iconClass}></i>
			</div>
		);
	}

});

module.exports = Message;