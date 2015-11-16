module.exports = function (sequelize, DataTypes) {
	return sequelize.define('User', {
		firstName: {
			type: DataTypes.STRING,
			field: 'first_name'
		},
		lastName: {
			type: DataTypes.STRING,
			field: 'last_name'
		},
		tn: {
			type: DataTypes.STRING,
			field: 'phone_number',
			allowNull: false
		},
		role: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'role'
		}
	});
};