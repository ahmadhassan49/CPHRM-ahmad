const { sequelize , User, Department, Role, UserProfile, Employment } = require('../models/index');
const { Op } = require('sequelize');

const register_user = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const departments = await Department.findAll();
            const roles = await Role.findAll();
            const statuses = await Employment.findAll({
                where: {
                    status: {
                        [Op.notIn]: ['terminated', 'resigned']
                    }
                }
            });
            res.render('register', { departments, roles, statuses });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
    else if (req.method === 'POST') {
        try {
            const { reg_email, reg_password, cpassword, f_name, l_name, department, role, status, designation } = req.body;

            const existingUser = await User.findOne({ where: { email: reg_email } });
            if (existingUser) {
                return res.status(400).send({ message: 'Email already registered' });
            }

            // const user = await User.create({ email: reg_email, password: reg_password, department_id: department, role_id: role });
            // await UserProfile.create({ fullName: f_name, user_id: user.id });

            try {
                await sequelize.transaction(async (t) => {
                    const user = await User.create({ email: reg_email, password: reg_password, department_id: department, role_id: role, employment_id: status, is_admin: 'false', is_user: 'true' }, { transaction: t });
                    await UserProfile.create({ first_name: f_name, last_name: l_name, user_id: user.id, designation: designation }, { transaction: t });
                });
            } catch (error) {
                console.error(error);
                return res.status(400).send({ message: 'Error in Registering Profile' });
            }

            res.status(200).send({ status: 'success', message: 'User registered successfully!' });
            // res.render('register', { department, role, successMessage: true });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
};

module.exports = {
    register_user,
};
