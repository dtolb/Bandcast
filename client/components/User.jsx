var React = require('react');
var common = require('../common');

var User = React.createClass({
	deleteUser : function () {
		var self = this;

		common.request({
			method : 'delete',
			url : '/users?tn=' + encodeURIComponent(this.props.user.tn)
		})
		.then(function () {
			self.props.requestParentReload();
		});
	},

	render: function() {
		return (
			<div className='user'>
				<div className='user-name'>{this.props.user.firstName} {this.props.user.lastName}</div>
				<div className='user-number'>{this.props.user.tn}</div>
				<div className='user-delete' onClick={this.deleteUser}><i className='fa fa-trash'></i></div>
			</div>
		);
	}

});

module.exports = User;