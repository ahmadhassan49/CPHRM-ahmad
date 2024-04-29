const { DataTypes } = require('sequelize');
const { FOREIGNKEYS } = require('sequelize/lib/query-types');

module.exports = (sequelize) => {
    // leaveType table
    const leaveType = sequelize.define('leaveType', {
        name: { type: DataTypes.STRING, allowNull: true }
    }, {
        tableName: 'leaveType',
        timestamps: true
    });
    // leave qouta 
    const leaveQouta = sequelize.define('leaveQouta', {
        employeestatus: { type: DataTypes.STRING, allowNull: true },
        numberofleaves: { type: DataTypes.STRING, allowNull: true },
    }, {
        tableName: 'leaveQouta',
        timestamps: true
    });
    leaveQouta.belongsTo(leaveType, { foreignkey: 'leavetypeid' })
    // leave reamaing 
    const leaveremaining = sequelize.define('leaveremaining', {
        remainingleave: { type: DataTypes.STRING, allowNull: true }
    }, {
        tableName: 'leaveremaining',
        timestamps: true
    });
    leaveremaining.belongsTo(leaveType, { foreignkey: 'leavetypeid' })

    // leave history
    const leavehistory = sequelize.define('leavehistory', {
        // remainingleave: { type: DataTypes.STRING, allowNull: true }
    }, {
        tableName: 'leavehistory',
        timestamps: true
    });
    leavehistory.belongsTo(leaveType, { foreignkey: 'leavetypeid' })



    return { leaveremaining, leaveType, leaveQouta };
}