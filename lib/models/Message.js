module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Message', {
		text: DataTypes.STRING,
		to: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'to'
		},
		fromNumber: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'from_number'
		}
	});
};