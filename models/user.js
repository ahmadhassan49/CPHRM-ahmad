const { DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    const Department = sequelize.define('Department', {
        name: { type: DataTypes.STRING, allowNull: false, unique: true }
    }, {
        tableName: 'department',
        timestamps: true
    });

    const Role = sequelize.define('Role', {
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        department_id: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        tableName: 'role',
        timestamps: true
    });

    const Employment = sequelize.define('Employment', {
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        tableName: 'employment',
        timestamps: false
    });

    const User = sequelize.define('User', {
        email: { type: DataTypes.STRING, allowNull: true },
        password: { type: DataTypes.STRING, allowNull: false },
        department_id: { type: DataTypes.INTEGER, allowNull: false },
        role_id: { type: DataTypes.INTEGER, allowNull: false },
        employment_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Employment', key: 'id'}},
        is_admin: { type: DataTypes.BOOLEAN, allowNull: false },
        is_user: { type: DataTypes.BOOLEAN, allowNull: false },
        // is_manager: { type: DataTypes.BOOLEAN, allowNull: false },
        is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    }, {
        tableName: 'user',
        timestamps: true,
        hooks: {
            beforeValidate: (user, options) => {
                if (user.is_admin && user.is_user) {
                    throw new Error('User cannot be both admin and regular user');
                } else if (!user.is_admin && !user.is_user) {
                    throw new Error('User must be either admin or regular user');
                }
            }
        }
    });

    const UserProfile = sequelize.define('UserProfile', {
        first_name: { type: DataTypes.STRING, allowNull: true },
        last_name: { type: DataTypes.STRING, allowNull: true },
        fatherName: { type: DataTypes.STRING, allowNull: true },
        phone: { type: DataTypes.STRING, allowNull: true },
        dob: { type: DataTypes.DATE, allowNull: true },
        religion: { type: DataTypes.STRING, allowNull: true },
        nationality: { type: DataTypes.STRING, allowNull: true },
        cnic: { type: DataTypes.STRING, allowNull: true },
        gender: { type: DataTypes.STRING, allowNull: true },
        address: { type: DataTypes.STRING, allowNull: true },
        designation: { type: DataTypes.STRING, allowNull: true },
        line_manager: { type: DataTypes.STRING, allowNull: true },
        personal_email: { type: DataTypes.STRING, allowNull: true },
        doj: { type: DataTypes.DATE, allowNull: true },
        salary: { type: DataTypes.STRING, allowNull: true },
        leaveBank: { type: DataTypes.STRING, allowNull: true },
        picture: { type: DataTypes.STRING, allowNull: true },
        description: { type: DataTypes.TEXT, allowNull: true },
    }, {
        tableName: 'userprofile',
        timestamps: true
    });

    User.hasOne(UserProfile, { foreignKey: 'user_id', as: 'profile' });

    User.belongsTo(Department, { foreignKey: 'department_id', as: 'user_department' });
    User.belongsTo(Role, { foreignKey: 'role_id', as: 'user_role' });
    Role.belongsTo(Department, { foreignKey: 'department_id', as: 'role_department' });

    User.belongsTo(Employment, { foreignKey: 'employment_id', as: 'employmentStatus' });

    User.prototype.getFullName = async function() {
        const userProfile = await this.getProfile();
        if (userProfile) {
            const { first_name, last_name } = userProfile;
            return (first_name && last_name) ? `${first_name} ${last_name}` : (first_name || last_name);
        } else {
            return null;
        }
    };

    // Define a method to find a department by its ID
    User.prototype.findDepartmentById = async function(departmentId) {
        try {
            const department = await Department.findOne({ where: { id: departmentId } });
            return department;
        } catch (error) {
            console.error('Error finding department:', error);
            throw error;
        }
    };

    // Define a method to find a role by its ID
    User.prototype.findRoleById = async function(roleId) {
        try {
            const role = await Role.findOne({ where: { id: roleId } });
            return role;
        } catch (error) {
            console.error('Error finding role:', error);
            throw error;
        }
    };


    return { User, Department, Role, UserProfile, Employment };
};