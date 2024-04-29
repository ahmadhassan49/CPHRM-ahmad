const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('cphrmdev', 'root', '123', {
    host: 'localhost',
    logging: false,
    dialect: 'mysql'
});

const { User, UserProfile, Department, Role, Employment } = require('./user')(sequelize, DataTypes);
const { leaveremaining, leaveType, leaveQouta } = require('./leave')(sequelize,DataTypes);

const createEmploymentStatuses = async () => {
    try {
        const existingStatuses = await Employment.findAll();
        if (existingStatuses.length === 0) {
            // If no statuses exist, insert them
            await Employment.bulkCreate([
                { status: 'internship' },
                { status: 'probation' },
                { status: 'permanent' },
                { status: 'terminated' },
                { status: 'resigned' }
            ]);
            console.log('Employment statuses added successfully');
        } else {
            console.log('Employment statuses already exist');
        }
    } catch (error) {
        console.error('Error adding employment statuses:', error);
    }
};

sequelize.authenticate()
    .then(async () => {
        console.log('Database connected successfully');

        await sequelize.sync({ alter: true });
        console.log('Models synchronized with database');
        await createEmploymentStatuses();

        let adminDepartment = await Department.findOne({ where: { name: 'Administrator' } });
        if (!adminDepartment) {
            adminDepartment = await Department.create({ name: 'Administrator' });
        }

        let adminRole = await Role.findOne({ where: { name: 'Admin' } });
        if (!adminRole) {
            adminRole = await Role.create({ name: 'Admin', department_id: adminDepartment.id });
        }

        const permanentEmploymentStatus = await Employment.findOne({ where: { status: 'permanent' } });
        if (!permanentEmploymentStatus) {
            throw new Error("Permanent employment status not found in the database");
        }
        const permanentEmploymentStatusId = permanentEmploymentStatus.id;

        let defaultUser = await User.findOne({ where: { email: 'admin@gmail.com' } });
        if (!defaultUser) {
            defaultUser = await User.create({
                email: 'admin@gmail.com',
                password: '123',
                department_id: adminDepartment.id,
                role_id: adminRole.id,
                employment_id: permanentEmploymentStatusId,
                is_admin: 'true',
                is_user: 'false',
            });
        }

        console.log('Default records added successfully');
    })
    .catch(error => {
        console.error('Error initializing database:', error);
        process.exit(1);
    });

module.exports = { sequelize, User, UserProfile, Department, Role, Employment };
