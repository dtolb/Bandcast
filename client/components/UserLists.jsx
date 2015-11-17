var React = require('react');
var common = require('../common');
var User = require('./User');
var AddUsers = require('./AddUsers');

var UserLists = React.createClass({
	getInitialState : function () {
		return { activeTab : 0 };
	},

	handleTabClick : function (index) {
		this.setState({ activeTab : index });
	},

	render: function() {
		var self = this;

		if (!this.props.users) {
			return (<div className='user-lists'><div className='loader'>Loading</div></div>);
		}

		var organizers = this.props.users.map(function (user) {
			if (user.role === common.ORGANIZERS) {
				return (<User user={user} key={user.tn} requestParentReload={self.props.requestParentReload}/>);
			}
		});

		var attendees = this.props.users.map(function (user) {
			if (user.role === common.ATTENDEES) {
				return (<User user={user} key={user.tn}/>);
			}
		});

		var organizerTabClass =
			this.state.activeTab === 0 ?
			'tab active-tab' :
			'tab';

		var attendeeTabClass =
			this.state.activeTab === 1 ?
			'tab active-tab' :
			'tab';

		var addUsersNode = (
			<AddUsers
				role={this.state.activeTab === 0 ? common.ORGANIZERS : common.ATTENDEES }
				addUser={this.props.addUser}
				/>
		);

		return (
			<div className='user-lists'>
				<div className='tab-area'>
					<div
						className={organizerTabClass}
						onClick={this.handleTabClick.bind(this, 0)}>

						Organizers
					</div>
					<div
						className={attendeeTabClass}
						onClick={this.handleTabClick.bind(this, 1)}>

						Attendees
					</div>
				</div>
				<div className='users'>
					{
						this.state.activeTab === 0 ?
						organizers :
						attendees
					}
				</div>
				{addUsersNode}

				<div className='expand-button' onClick={this.props.toggleConversationCollapsed}>
					<i className='fa fa-bars'></i>
				</div>
			</div>
		);
	}

});

module.exports = UserLists;